import { Link } from "react-router-dom";
import "./Avisos.css";
import { useAvisos, cerrarAviso, cerrarMatch } from "../avisos";

function Avisos() {
  const { avisos, match } = useAvisos();

  return (
    <>
      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`}>
            <span className="aviso-icono">{aviso.tipo === "exito" ? "🐾" : "⚠️"}</span>
            <p>{aviso.mensaje}</p>
            <button type="button" aria-label="Cerrar aviso" onClick={() => cerrarAviso(aviso.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {match && (
        <div className="match-fondo" role="dialog" aria-modal="true">
          <div className="match-caja">
            <span className="match-corazon">❤️</span>
            <h2>¡Es un match!</h2>
            <p>
              A {match.miNombre} y a {match.nombre} les gustaron sus perfiles.
            </p>
            <div className="match-botones">
              <Link to={`/mascota/${match.id}`} className="match-ver" onClick={cerrarMatch}>
                Ver perfil de {match.nombre}
              </Link>
              <button type="button" className="match-seguir" onClick={cerrarMatch}>
                Seguir buscando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Avisos;
