import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import AuthSidebar from "../components/AuthSidebar";
import IconoOjo from "../components/IconoOjo";
import iconoMail from "../assets/icono-mail.png";
import iconoCorazon from "../assets/icono-corazon.png";
import iconoPata from "../assets/icono-pata.png";

function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/usuario/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mail: email,
            password: contraseña
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      navigate("/buscar");
    } catch (error) {
      alert("No se pudo conectar con el servidor");
      console.error(error);
    }
  }

  return (
    <div className="auth-page">
      <AuthSidebar />

      <main className="auth-content">
        <div className="auth-form-box">
          <h2>¡Bienvenido de nuevo!</h2>
          <p className="auth-subtitle">
            Nos alegra verte otra vez
            <img src={iconoCorazon} alt="" className="inline-heart" />
          </p>

          <form onSubmit={handleLogin}>
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
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
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
              Iniciar sesión
              <img src={iconoPata} alt="" className="btn-paw" />
            </button>
          </form>

          <hr />

          <p className="auth-switch">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </div>
      </main>
    </div>  
  );
}

export default Login;