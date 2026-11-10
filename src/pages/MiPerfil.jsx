import { Link } from "react-router-dom";
import "./Configuracion.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { obtenerIdUsuario } from "../api";
import { useUsuario } from "../hooks/useUsuario";

function MiPerfil() {
  const { usuario, cargado } = useUsuario(obtenerIdUsuario());

  const filas = usuario
    ? [
        ["Nombre", usuario.nombre],
        ["Apellido", usuario.apellido],
        ["Correo electrónico", usuario.mail],
        ["Teléfono", usuario.telefono],
      ]
    : [];

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />

        <div className="config-content">
          <h1>Mi perfil</h1>

          <div className="config-card">
            {!cargado && <p>Cargando tus datos...</p>}
            {cargado && !usuario && <p>No pudimos cargar tus datos en este momento.</p>}

            {filas.map(([label, valor]) => (
              <div key={label} className="config-fila perfil-fila">
                {label}
                <span>{valor}</span>
              </div>
            ))}

            <Link to="/mi-mascota" className="config-fila perfil-link">
              Ver mis mascotas <span>›</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
