import { Link } from "react-router-dom";
import { IconoCorazon } from "./Iconos";
import { useFavoritos } from "../hooks/useFavoritos";

function TarjetaMascota({ id, imagen, nombre, raza, edad, sexo, ubicacion }) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const favorito = esFavorito(id);

  return (
    <div className="tarjeta-mascota">
      <img src={imagen} alt={nombre} className="tarjeta-mascota-img" />

      <div className="tarjeta-mascota-info">
        <h3>{nombre}</h3>
        <p>🐾 {raza}</p>
        <p>📅 {edad}</p>
        <p>{sexo === "Macho" ? "♂" : "♀"} {sexo}</p>
        <p>📍 {ubicacion}</p>

        <div className="tarjeta-mascota-footer">
          <Link to={`/mascota/${id}`} className="tarjeta-mascota-btn">
            Ver perfil
          </Link>
          <button type="button" className="tarjeta-mascota-fav-btn" onClick={() => toggleFavorito(id)}>
            <IconoCorazon activo={favorito} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetaMascota;