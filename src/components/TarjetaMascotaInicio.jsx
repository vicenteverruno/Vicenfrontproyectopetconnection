import "./TarjetaMascota.css";
import { useNavigate } from "react-router-dom";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoCorazon } from "./Iconos";
import { useLike } from "../hooks/useLike";

function TarjetaMascotaInicio({ id, imagen, nombre, raza, edad, sexo, ubicacion, esMia }) {
  const navigate = useNavigate();
  const { favorito, alternarLike } = useLike(id, nombre);

  const irAlPerfil = () => {
    navigate(`/mascota/${id}`);
  };

  const handleFavoritoClick = (e) => {
    e.stopPropagation(); // Evita redirigir al clickear el corazón
    alternarLike();
  };

  return (
    <div className="tm-card" onClick={irAlPerfil}>
      <img src={imagen} alt={nombre} className="tm-img" />

      <div className="tm-info">
        <h3 className="tm-nombre">
          {nombre}
          {esMia && <span className="tm-badge">Tu mascota</span>}
        </h3>

        <p className="tm-detalle"><IconoPata /> {raza}</p>
        <p className="tm-detalle"><IconoCalendario /> {edad}</p>
        <p className="tm-detalle">
          <span className="tm-simbolo">{sexo === "Macho" ? "♂" : "♀"}</span> {sexo}
        </p>
        <p className="tm-detalle"><IconoUbicacion /> {ubicacion}</p>

        <div className="tm-footer">
          <button type="button" className="tm-btn" onClick={irAlPerfil}>
            Ver perfil
          </button>

          <div className="tm-acciones">
            {!esMia && (
              <button type="button" className="tm-circulo" onClick={handleFavoritoClick}>
                <IconoCorazon activo={favorito} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaMascotaInicio;