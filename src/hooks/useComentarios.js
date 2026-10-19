import { useState, useEffect } from "react";

const CLAVE = "petconnection_comentarios";

// Comentarios de ejemplo de otros usuarios (hasta que haya backend)
const comentariosIniciales = {
  1: [
    { id: "1-a", texto: "Qué carita más simpática!", hora: "09:12" },
    { id: "1-b", texto: "Hermoso Roberto, me encantó su perfil", hora: "09:40" },
    { id: "1-c", texto: "¿Tiene las vacunas al día?", hora: "10:05" },
  ],
  2: [
    { id: "2-a", texto: "Qué lindo Golden!", hora: "08:55" },
    { id: "2-b", texto: "Me interesa mucho conocerlo", hora: "09:30" },
    { id: "2-c", texto: "Tengo una hembra de la misma raza", hora: "10:18" },
  ],
  3: [
    { id: "3-a", texto: "Es hermoso!", hora: "11:02" },
    { id: "3-b", texto: "Los Boyeros de Berna son los mejores", hora: "11:25" },
  ],
};

function leerGuardados() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : {};
  } catch {
    return {};
  }
}

export function useComentarios(mascotaId) {
  const [guardados, setGuardados] = useState(leerGuardados);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(guardados));
  }, [guardados]);

  const iniciales = comentariosIniciales[mascotaId] || [];
  const propios = guardados[mascotaId] || [];
  const comentarios = [...iniciales, ...propios];

  const agregarComentario = (texto) => {
    const hora = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nuevo = { id: Date.now(), texto, hora };

    setGuardados((actual) => ({
      ...actual,
      [mascotaId]: [...(actual[mascotaId] || []), nuevo],
    }));
  };

  return { comentarios, agregarComentario };
}