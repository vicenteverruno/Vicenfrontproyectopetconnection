import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import iconoInicio from "../assets/icono-inicio.png";
import iconoBuscar from "../assets/icono-buscar.png";
import iconoFavoritos from "../assets/icono-favoritos.png";
import iconoPata from "../assets/icono-pata.png";
import iconoNotificaciones from "../assets/icono-notificaciones.png";

function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <NavLink to="/inicio" className="app-sidebar-logo-link">
        <img src={logo} alt="Pet Connection" className="app-sidebar-logo" />
      </NavLink>

      <nav className="app-sidebar-nav">
        <NavLink to="/inicio" className="app-sidebar-link">
          <img src={iconoInicio} alt="" className="app-sidebar-icon" />
          Inicio
        </NavLink>
        <NavLink to="/buscar" className="app-sidebar-link">
          <img src={iconoBuscar} alt="" className="app-sidebar-icon" />
          Buscar
        </NavLink>
        <NavLink to="/favoritos" className="app-sidebar-link">
          <img src={iconoFavoritos} alt="" className="app-sidebar-icon" />
          Mis favoritos
        </NavLink>
        <NavLink to="/mi-mascota" className="app-sidebar-link">
          <img src={iconoPata} alt="" className="app-sidebar-icon app-sidebar-icon-pata" />
          Mi mascota
        </NavLink>
        <NavLink to="/notificaciones" className="app-sidebar-link">
          <img src={iconoNotificaciones} alt="" className="app-sidebar-icon" />
          Notificaciones
        </NavLink>
      </nav>

      <div className="app-sidebar-divider"></div>

      <NavLink to="/configuracion" className="app-sidebar-link app-sidebar-config">
        ⚙️ Configuración
      </NavLink>
    </aside>
  );
}

export default AppSidebar;