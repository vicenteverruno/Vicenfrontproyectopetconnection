import { Link } from "react-router-dom";

function TopBar() {
  return (
    <header className="app-topbar">
      <div className="app-search">
        <span>🔎</span>
        <input type="text" placeholder="Buscar mascotas por raza, ubicación, etc..." />
      </div>

      <div className="app-topbar-icons">
        <Link to="/notificaciones" className="app-topbar-bell">🔔</Link>
        <Link to="/mi-mascota" className="app-topbar-profile">👤</Link>
      </div>
    </header>
  );
}

export default TopBar;