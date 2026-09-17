import { Link } from "react-router-dom";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoMensaje, IconoCorazon } from "./Iconos";
import { useFavoritos } from "../hooks/useFavoritos";

function TarjetaMascotaInicio({ id, imagen, nombre, raza, edad, sexo, ubicacion }) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const favorito = esFavorito(id);

  return (
    <div className="inicio-tarjeta">
      <div className="inicio-tarjeta-img-wrap">
        <img src={imagen} alt={nombre} className="inicio-tarjeta-img" />
      </div>

      <div className="inicio-tarjeta-info">
        <h3>{nombre}</h3>

        <p className="inicio-tarjeta-detalle"><IconoPata /> {raza}</p>
        <p className="inicio-tarjeta-detalle"><IconoCalendario /> {edad}</p>
        <p className="inicio-tarjeta-detalle">
          <span className="inicio-tarjeta-simbolo">{sexo === "Macho" ? "♂" : "♀"}</span> {sexo}
        </p>
        <p className="inicio-tarjeta-detalle"><IconoUbicacion /> {ubicacion}</p>

        <div className="inicio-tarjeta-footer">
          <Link to={`/mascota/${id}`} className="inicio-tarjeta-btn">
            Ver perfil
          </Link>

          <div className="inicio-tarjeta-acciones">
            <button type="button" className="inicio-tarjeta-circulo">
              <IconoMensaje />
            </button>
            <button
              type="button"
              className="inicio-tarjeta-circulo"
              onClick={() => toggleFavorito(id)}
            >
              <IconoCorazon activo={favorito} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaMascotaInicio;