import { useState, useEffect, useCallback } from "react"; // CAMBIADO: se agrega useCallback
import { apiFetch } from "../api"; // AGREGADO
import { useMiMascota } from "./useMiMascota"; // AGREGADO: para saber el id de TU mascota
 
// SACADO: const CLAVE = "petconnection_comentarios";
// SACADO: const comentariosIniciales = { 1: [...], 2: [...], 3: [...] };
// SACADO: function leerGuardados() { ... }
 
// AGREGADO: el back guarda solo la fecha (sin hora): "2026-11-05T00:00:00.000Z" -> "05/11/2026"
function formatearFecha(fecha) {
  const partes = String(fecha || "").slice(0, 10).split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : "";
}
 
export function useComentarios(mascotaId) {
  const [miMascota] = useMiMascota(); // AGREGADO
  const [comentarios, setComentarios] = useState([]); // CAMBIADO: arranca vacío y se llena desde el back
 
  // AGREGADO: trae los comentarios de esa mascota desde el back
  const cargar = useCallback(async () => {
    try {
      const response = await apiFetch(`/comentario/${mascotaId}`);
      const data = await response.json();
 
      if (!response.ok) {
        console.error("Error al obtener comentarios:", data.message);
        return;
      }
 
      // Se adaptan los nombres del back (id_comentario, fecha) a los que usa tu pantalla (id, hora)
      setComentarios(
        data
          .map((c) => ({
            id: c.id_comentario,
            texto: c.texto,
            hora: formatearFecha(c.fecha),
          }))
          .sort((a, b) => a.id - b.id) // los más viejos arriba, como en un chat
      );
    } catch (error) {
      console.error("No se pudo conectar con el servidor:", error);
    }
  }, [mascotaId]);
 
  // AGREGADO: carga los comentarios al entrar a la pantalla
  useEffect(() => {
    cargar();
  }, [cargar]);
 
  // CAMBIADO: antes guardaba en localStorage, ahora lo manda al back (POST /comentario)
  const agregarComentario = async (texto) => {
    if (!miMascota.idMascota) {
      alert("Primero tenés que publicar tu mascota para poder comentar.");
      return;
    }
 
    try {
      const response = await apiFetch("/comentario", {
        method: "POST",
        body: JSON.stringify({
          texto,
          id_mascota_1: miMascota.idMascota, // tu mascota (la que comenta)
          id_mascota_2: Number(mascotaId),   // la mascota comentada
        }),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        alert(data.message || "No se pudo enviar el comentario");
        return;
      }
 
      await cargar(); // vuelve a pedir la lista para que aparezca el comentario nuevo
    } catch (error) {
      alert("No se pudo conectar con el servidor");
      console.error(error);
    }
  };
 
  return { comentarios, agregarComentario };
}