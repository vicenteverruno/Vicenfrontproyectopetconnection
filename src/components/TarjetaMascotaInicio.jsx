import { useState } from "react"; // AGREGADO
import "./TarjetaMascota.css";
import { useNavigate } from "react-router-dom";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoCorazon } from "./Iconos";
import { useFavoritos } from "../hooks/useFavoritos";
import { useMiMascota } from "../hooks/useMiMascota"; // AGREGADO
import { apiFetch } from "../api"; // AGREGADO

function TarjetaMascotaInicio({ id, imagen, nombre, raza, edad, sexo, ubicacion, esMia }) {
  const navigate = useNavigate();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [miMascota] = useMiMascota(); // AGREGADO: para saber quién da el like
  const [enviando, setEnviando] = useState(false); // AGREGADO
  const favorito = esFavorito(id);

  const irAlPerfil = () => {
    navigate(`/mascota/${id}`);
  };

  // CAMBIADO: antes solo hacía toggleFavorito(id). Ahora primero avisa al back,
  // y si el back responde bien, recién ahí cambia el corazón.
  const handleFavoritoClick = async (e) => {
    e.stopPropagation(); // Evita redirigir al clickear el corazón
    if (enviando) return;

    if (!miMascota.idMascota) {
      alert("Primero tenés que publicar tu mascota para poder dar like.");
      return;
    }

    setEnviando(true);

    try {
      // Si ya tenía like -> DELETE (sacar like). Si no -> POST (dar like).
      const response = await apiFetch("/like", {
        method: favorito ? "DELETE" : "POST",
        body: JSON.stringify({
          id_mascota_1: miMascota.idMascota, // tu mascota
          id_mascota_2: id,                  // la mascota a la que le das like
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Si el corazón y la base de datos no coinciden, se sincronizan igual
      const yaExistia = !favorito && data.message === "Este like ya existe";
      const yaNoExistia = favorito && response.status === 404;

      if (!response.ok && !yaExistia && !yaNoExistia) {
        alert(data.message || "No se pudo actualizar el like");
        return;
      }

      toggleFavorito(id);
    } catch (error) {
      alert("No se pudo conectar con el servidor");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  // ---------- TODO LO DE ABAJO ES IGUAL A TU ARCHIVO ----------
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
            <button type="button" className="tm-circulo" onClick={handleFavoritoClick}>
              <IconoCorazon activo={favorito} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaMascotaInicio;