import "./Inicio.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import { mascotasEjemplo } from "../data/mascotas";

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

            <div className="inicio-banner-imagen">
              <img src={bannerPerro} alt="Mascota" />
              <span className="inicio-banner-corazon corazon-1">❤️</span>
              <span className="inicio-banner-corazon corazon-2">❤️</span>
              <span className="inicio-banner-corazon corazon-3">❤️</span>
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