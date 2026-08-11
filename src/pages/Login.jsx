import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

// Imágenes
import logo from "../assets/logo.png.png";
import escudo from "../assets/escudo.png.png";
import globotexto from "../assets/globotexto.png.png";
import perros from "../assets/perros.png.png";

function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <div className="login-page">

      {/* COLUMNA IZQUIERDA */}
      <aside className="login-sidebar">

        {/* LOGO */}
        <div className="login-logo">
          <img
            className="login-logo-icon"
            src={logo}
            alt="Pet Connection"
          />
        </div>

        {/* TÍTULO */}
        <h1 className="login-sidebar-title">
          Encontrá el compañero ideal para tu mascota
        </h1>

        {/* CARACTERÍSTICAS */}
        <ul className="login-features">

          <li>
            <img
              className="login-feature-icon"
              src={escudo}
              alt="Perfiles verificados"
            />

            <div>
              <strong>Perfiles verificados</strong>
              <p>
                Usuarios y mascotas verificados para tu seguridad.
              </p>
            </div>
          </li>

          <li>
            <img
              className="login-feature-icon"
              src={globotexto}
              alt="Chat seguro"
            />

            <div>
              <strong>Chat seguro</strong>
              <p>
                Contactá con otros dueños de forma segura y fácil.
              </p>
            </div>
          </li>

        </ul>

        {/* PERROS */}
        <div className="login-sidebar-image">
          <img
            src={perros}
            alt="Mascotas"
          />
        </div>

      </aside>


      {/* COLUMNA DERECHA */}
      <main className="login-content">

        <div className="login-form-box">

          <h2>¡Bienvenido de nuevo!</h2>

          <p className="login-subtitle">
            Nos alegra verte otra vez 💚
          </p>


          <form>

            {/* EMAIL */}
            <label htmlFor="email">
              Correo electrónico
            </label>

            <div className="login-input">

              <span className="input-icon">✉</span>

              <input
                id="email"
                type="email"
                placeholder="tuemail@gmail.com"
              />

            </div>


            {/* CONTRASEÑA */}
            <label htmlFor="password">
              Contraseña
            </label>

            <div className="login-input">

              <span className="input-icon">🔒</span>

              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="Tu contraseña"
              />

              {/* BOTÓN MOSTRAR / OCULTAR */}
              <button
                type="button"
                className="login-toggle-password"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? "◉̸" : "◉"}
              </button>

            </div>


            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              className="login-submit"
            >
              Iniciar sesión 🐾
            </button>

          </form>


          <hr />


          {/* REGISTRO */}
          <p className="login-register">
            ¿No tenés cuenta?{" "}
            <Link to="/registro">
              Registrate
            </Link>
          </p>

        </div>

      </main>

    </div>
  );
}

export default Login;