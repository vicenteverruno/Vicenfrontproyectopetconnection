import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import AuthSidebar from "../components/AuthSidebar";
import IconoOjo from "../components/IconoOjo";
import iconoMail from "../assets/icono-mail.png";
import iconoCorazon from "../assets/icono-corazon.png";
import iconoPata from "../assets/icono-pata.png";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            alert(data.message || "Error al registrarse");
            return;
        }

        alert("¡Usuario registrado correctamente!");

        navigate("/");

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("No se pudo conectar con el servidor");
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

          <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <div className="auth-input">
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <label htmlFor="apellido">Apellido</label>
            <div className="auth-input">
              <input
                id="apellido"
                type="text"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <label htmlFor="telefono">Teléfono</label>
            <div className="auth-input">
              <input
                id="telefono"
                type="tel"
                placeholder="+54 11 1234-5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <label htmlFor="email">Correo electrónico</label>
            <div className="auth-input">
              <img src={iconoMail} alt="" className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="tuemail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label htmlFor="password">Contraseña</label>
            <div className="auth-input">
              <img src={iconoMail} alt="" className="input-icon" />
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                <IconoOjo abierto={mostrarPassword} />
              </button>
            </div>

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