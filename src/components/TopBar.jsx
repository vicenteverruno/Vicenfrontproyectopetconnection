import "./TopBar.css";
import { Link } from "react-router-dom";
import iconoNotificaciones from "../assets/icono-notificaciones.png";
import perfil from "../assets/perfil.png";
import { useNotificaciones } from "../hooks/useNotificaciones";

function TopBar({ volverA }) {
  const { hayNuevas } = useNotificaciones();

  return (
    <header className="app-topbar app-topbar-sin-linea">
      {volverA && (
        <Link to={volverA} className="app-topbar-volver">
          ‹ Volver
        </Link>
      )}

      <div className="app-topbar-icons">
        <Link
          to="/notificaciones"
          className={`app-topbar-icon-link ${hayNuevas ? "tiene-notificacion" : ""}`}
        >
          <img src={iconoNotificaciones} alt="Notificaciones" className="app-topbar-icon-img" />
        </Link>
        <Link to="/perfil" className="app-topbar-icon-link">
          <img src={perfil} alt="Mi perfil" className="app-topbar-icon-img app-topbar-perfil-img" />
        </Link>
      </div>
    </header>
  );
}

export default TopBar;
