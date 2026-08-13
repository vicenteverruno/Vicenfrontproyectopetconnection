import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <img src={logo} alt="Pet Connection" className="app-sidebar-logo" />

      <nav className="app-sidebar-nav">
        <NavLink to="/inicio" className="app-sidebar-link">
          🏠 Inicio
        </NavLink>
        <NavLink to="/buscar" className="app-sidebar-link">
          🔍 Buscar
        </NavLink>
        <NavLink to="/favoritos" className="app-sidebar-link">
          🤍 Mis favoritos
        </NavLink>
        <NavLink to="/mi-mascota" className="app-sidebar-link">
          🐾 Mi mascota
        </NavLink>
        <NavLink to="/notificaciones" className="app-sidebar-link">
          🔔 Notificaciones
        </NavLink>
      </nav>

      <NavLink to="/configuracion" className="app-sidebar-link app-sidebar-config">
        ⚙️ Configuración
      </NavLink>
    </aside>
  );
}

export default AppSidebar;