import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import AuthSidebar from "../components/AuthSidebar";
import IconoOjo from "../components/IconoOjo";
import iconoMail from "../assets/icono-mail.png";
import iconoCorazon from "../assets/icono-corazon.png";
import iconoPata from "../assets/icono-pata.png";

function Registro() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <AuthSidebar />

      <main className="auth-content">
        <div className="auth-form-box">
          <h2>
            Crea una cuenta
            <img src={iconoCorazon} alt="" className="inline-heart" />
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/buscar"); }}>
            <label htmlFor="email">Correo electrónico</label>
            <div className="auth-input">
              <img src={iconoMail} alt="" className="input-icon" />
              <input id="email" type="email" placeholder="tuemail@gmail.com" />
            </div>

            <label htmlFor="password">Contraseña</label>
            <div className="auth-input">
              <img src={iconoMail} alt="" className="input-icon" />
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
            Ya tengo una cuenta <Link to="/">Iniciar sesión</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Registro;