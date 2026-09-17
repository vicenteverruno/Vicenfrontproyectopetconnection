import "./Favoritos.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import { mascotasEjemplo } from "../data/mascotas";
import { useFavoritos } from "../hooks/useFavoritos";

function Favoritos() {
  const { favoritos } = useFavoritos();
  const mascotasFavoritas = mascotasEjemplo.filter((m) => favoritos.includes(m.id));

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />

        <div className="favoritos-content">
          <h1>Mis favoritos</h1>
          <p className="favoritos-subtitulo">Las mascotas que guardaste como favoritas</p>

          {mascotasFavoritas.length === 0 ? (
            <p className="favoritos-vacio">
              Todavía no marcaste ninguna mascota como favorita. Tocá el corazón en cualquier
              tarjeta para guardarla acá.
            </p>
          ) : (
            <div className="tarjetas-grid">
              {mascotasFavoritas.map((mascota) => (
                <TarjetaMascotaInicio key={mascota.id} {...mascota} imagen={mascota.fotos[0]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favoritos;