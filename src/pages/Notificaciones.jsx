import "./Notificaciones.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { notificacionesEjemplo } from "../data/notificaciones";

const iconosPorTipo = {
  match: "❤️",
  like: "❤️",
  comentario: "💬",
};

function Notificaciones() {
  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />
        <div className="notificaciones-content">
          <h1>Notificaciones</h1>
          <p className="notificaciones-subtitle">
            Tenés {notificacionesEjemplo.length} notificaciones nuevas
          </p>

          <div className="notificaciones-list">
            {notificacionesEjemplo.map((n) => (
              <div key={n.id} className="notificacion-card">
                <span className="notificacion-icono">{iconosPorTipo[n.tipo]}</span>

                <div className="notificacion-texto">
                  <strong>{n.titulo}</strong>
                  <p>{n.descripcion}</p>
                </div>

                <div className="notificacion-meta">
                  <span>{n.tiempo}</span>
                  <span className="notificacion-punto"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notificaciones;