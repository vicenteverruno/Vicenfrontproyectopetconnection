import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import AuthSidebar from "../components/AuthSidebar";

function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <div className="auth-page">
      <AuthSidebar />

      <main className="auth-content">
        <div className="auth-form-box">
          <h2>¡Bienvenido de nuevo!</h2>
          <p className="auth-subtitle">Nos alegra verte otra vez </p>

          <form>
            <label htmlFor="email">Correo electrónico</label>
            <div className="auth-input">
              <span>✉️</span>
              <input id="email" type="email" placeholder="tuemail@gmail.com" />
            </div>

            <label htmlFor="password">Contraseña</label>
            <div className="auth-input">
              <span>🔒</span>
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                className="auth-toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="auth-submit">
              Iniciar sesión 🐾
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