import "./Inicio.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import { mascotasEjemplo } from "../data/mascotas";

function CorazonRojo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#e11d2e">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function Inicio() {
  const bannerPerro = mascotasEjemplo[1].fotos[0];

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar />

        <div className="inicio-content">
          <div className="inicio-banner">
            <h1>Encontrá la pareja ideal para tu mascota</h1>

            <div className="inicio-banner-derecha">
              <img src={bannerPerro} alt="Mascota" className="inicio-banner-foto" />
              <div className="inicio-banner-corazones">
                <CorazonRojo className="corazon corazon-1" />
                <CorazonRojo className="corazon corazon-2" />
                <CorazonRojo className="corazon corazon-3" />
              </div>
            </div>
          </div>

          <h2 className="inicio-subtitulo">Mascotas recomendadas para vos</h2>

          <div className="tarjetas-grid">
            {mascotasEjemplo.map((mascota) => (
              <TarjetaMascotaInicio key={mascota.id} {...mascota} imagen={mascota.fotos[0]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;