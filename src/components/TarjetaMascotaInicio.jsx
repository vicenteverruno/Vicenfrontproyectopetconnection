import "./TarjetaMascota.css";
import { Link } from "react-router-dom";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoMensaje, IconoCorazon } from "./Iconos";
import { useFavoritos } from "../hooks/useFavoritos";

function TarjetaMascotaInicio({ id, imagen, nombre, raza, edad, sexo, ubicacion }) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const favorito = esFavorito(id);

  return (
    <div className="tm-card">
      <img src={imagen} alt={nombre} className="tm-img" />

      <div className="tm-info">
        <h3 className="tm-nombre">{nombre}</h3>

        <p className="tm-detalle"><IconoPata /> {raza}</p>
        <p className="tm-detalle"><IconoCalendario /> {edad}</p>
        <p className="tm-detalle">
          <span className="tm-simbolo">{sexo === "Macho" ? "♂" : "♀"}</span> {sexo}
        </p>
        <p className="tm-detalle"><IconoUbicacion /> {ubicacion}</p>

        <div className="tm-footer">
          <Link to={`/mascota/${id}`} className="tm-btn">
            Ver perfil
          </Link>

          <div className="tm-acciones">
            <button type="button" className="tm-circulo">
              <IconoMensaje />
            </button>
            <button type="button" className="tm-circulo" onClick={() => toggleFavorito(id)}>
              <IconoCorazon activo={favorito} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaMascotaInicio;