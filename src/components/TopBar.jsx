import { Link } from "react-router-dom";
import { IconoLupa } from "./Iconos";
import iconoNotificaciones from "../assets/icono-notificaciones.png";
import perfil from "../assets/perfil.png";

function TopBar() {
  return (
    <header className="app-topbar">
      <div className="app-search">
        <IconoLupa />
        <input type="text" placeholder="Buscar mascotas por raza, ubicación, etc..." />
      </div>

      <div className="app-topbar-icons">
        <Link to="/notificaciones" className="app-topbar-icon-link tiene-notificacion">
          <img src={iconoNotificaciones} alt="Notificaciones" className="app-topbar-icon-img" />
        </Link>
        <Link to="/mi-mascota" className="app-topbar-icon-link">
          <img src={perfil} alt="Perfil" className="app-topbar-icon-img app-topbar-perfil-img" />
        </Link>
      </div>
    </header>
  );
}

export default TopBar;