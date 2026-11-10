import { useEffect } from "react";
import "./Notificaciones.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { useNotificaciones, marcarVistas } from "../hooks/useNotificaciones";

const iconosPorTipo = {
  match: "❤️",
  like: "❤️",
  comentario: "💬",
};

function Notificaciones() {
  const { notificaciones } = useNotificaciones();

  useEffect(() => {
    marcarVistas();
  }, [notificaciones]);

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />
        <div className="notificaciones-content">
          <h1>Notificaciones</h1>
          <p className="notificaciones-subtitle">
            {notificaciones.length === 0
              ? "Todavía no tenés notificaciones"
              : `Tenés ${notificaciones.length} ${notificaciones.length === 1 ? "notificación" : "notificaciones"}`}
          </p>

          <div className="notificaciones-list">
            {notificaciones.map((n) => (
              <div key={n.id} className="notificacion-card">
                <span className="notificacion-icono">{iconosPorTipo[n.tipo]}</span>

                <div className="notificacion-texto">
                  <strong>{n.titulo}</strong>
                  <p>{n.descripcion}</p>
                </div>

                <div className="notificacion-meta">
                  <span>{n.tiempo}</span>
                  {n.esDeHoy && <span className="notificacion-punto"></span>}
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
