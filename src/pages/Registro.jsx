import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import AuthSidebar from "../components/AuthSidebar";
import IconoOjo from "../components/IconoOjo";
import iconoMail from "../assets/icono-mail.png";
import iconoCorazon from "../assets/icono-corazon.png";
import iconoPata from "../assets/icono-pata.png";
import { avisar } from "../avisos";

const MINIMO_DIGITOS_TELEFONO = 8;

function mensajeDeErrorRegistro(status, mensaje) {
  if (/duplicate|unique|duplicad/i.test(mensaje || "")) {
    return "Ya existe una cuenta registrada con esos datos.";
  }
  if (status >= 500) return "Hubo un problema en el servidor. Probá de nuevo.";
  return mensaje || "Error al registrarse";
}

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const nuevos = {};
    if (!nombre.trim()) nuevos.nombre = "Ingresá tu nombre.";
    if (!apellido.trim()) nuevos.apellido = "Ingresá tu apellido.";
    if (telefono.length < MINIMO_DIGITOS_TELEFONO) nuevos.telefono = "Ingresá un teléfono válido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nuevos.email = "Ingresá un correo electrónico válido.";
    if (!password) nuevos.password = "Ingresá una contraseña.";
    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/usuario/registro`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    mail: email,
                    telefono: telefono,
                    contraseña: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            avisar(mensajeDeErrorRegistro(response.status, data.message));
            return;
        }

        avisar("¡Te registraste correctamente! Ya podés iniciar sesión.", "exito");

        navigate("/");

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        avisar("No se pudo conectar con el servidor");
    }
};

  return (
    <div className="auth-page">
      <AuthSidebar />

      <main className="auth-content">
        <div className="auth-form-box">
          <h2>
            Creá una cuenta
            <img src={iconoCorazon} alt="" className="inline-heart" />
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="nombre">Nombre</label>
            <div className={`auth-input ${errores.nombre ? "auth-input-error" : ""}`}>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            {errores.nombre && <p className="auth-error">{errores.nombre}</p>}

            <label htmlFor="apellido">Apellido</label>
            <div className={`auth-input ${errores.apellido ? "auth-input-error" : ""}`}>
              <input
                id="apellido"
                type="text"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            {errores.apellido && <p className="auth-error">{errores.apellido}</p>}

            <label htmlFor="telefono">Teléfono</label>
            <div className={`auth-input ${errores.telefono ? "auth-input-error" : ""}`}>
              <input
                id="telefono"
                type="tel"
                inputMode="numeric"
                maxLength={15}
                placeholder="1112345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            {errores.telefono && <p className="auth-error">{errores.telefono}</p>}

            <label htmlFor="email">Correo electrónico</label>
            <div className={`auth-input ${errores.email ? "auth-input-error" : ""}`}>
              <img src={iconoMail} alt="" className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="tuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errores.email && <p className="auth-error">{errores.email}</p>}

            <label htmlFor="password">Contraseña</label>
            <div className={`auth-input ${errores.password ? "auth-input-error" : ""}`}>
              <img src={iconoMail} alt="" className="input-icon" />
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                <IconoOjo abierto={mostrarPassword} />
              </button>
            </div>
            {errores.password && <p className="auth-error">{errores.password}</p>}

            <button type="submit" className="auth-submit">
              Continuar
              <img src={iconoPata} alt="" className="btn-paw" />
            </button>
          </form>

          <hr />

          <p className="auth-switch">
            Ya tengo una cuenta <Link to="/Login">Iniciar sesión</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Registro;