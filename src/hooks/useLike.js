import { useState } from "react";
import { apiFetch } from "../api";
import { avisar, mostrarMatch } from "../avisos";
import { useFavoritos } from "./useFavoritos";
import { useMiMascota } from "./useMiMascota";

export function useLike(id, nombre) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [miMascota] = useMiMascota();
  const [enviando, setEnviando] = useState(false);
  const favorito = esFavorito(id);

  const alternarLike = async () => {
    if (enviando) return;

    if (!miMascota.idMascota) {
      avisar("Primero tenés que publicar tu mascota para poder dar like.");
      return;
    }

    setEnviando(true);

    try {
      const response = await apiFetch("/like", {
        method: favorito ? "DELETE" : "POST",
        body: JSON.stringify({
          id_mascota_1: miMascota.idMascota,
          id_mascota_2: id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Si el corazón y la base de datos no coinciden, se sincronizan igual
      const yaExistia = !favorito && data.message === "Este like ya existe";
      const yaNoExistia = favorito && response.status === 404;

      if (!response.ok && !yaExistia && !yaNoExistia) {
        avisar(data.message || "No se pudo actualizar el like");
        return;
      }

      toggleFavorito(id);

      if (data.id_match) {
        mostrarMatch({ id, nombre, miNombre: miMascota.nombre });
      }
    } catch (error) {
      avisar("No se pudo conectar con el servidor");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  return { favorito, enviando, alternarLike };
}
