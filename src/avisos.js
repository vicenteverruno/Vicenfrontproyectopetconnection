import { useSyncExternalStore } from "react";

const DURACION_MS = 4500;
const oyentes = new Set();
let estado = { avisos: [], match: null };
let proximoId = 1;

function publicar(cambios) {
  estado = { ...estado, ...cambios };
  oyentes.forEach((avisarOyente) => avisarOyente());
}

export function cerrarAviso(id) {
  publicar({ avisos: estado.avisos.filter((a) => a.id !== id) });
}

// tipo: "exito" | "error"
export function avisar(mensaje, tipo = "error") {
  const id = proximoId++;
  publicar({ avisos: [...estado.avisos, { id, mensaje, tipo }] });
  setTimeout(() => cerrarAviso(id), DURACION_MS);
}

export function mostrarMatch(match) {
  publicar({ match });
}

export function cerrarMatch() {
  publicar({ match: null });
}

function suscribirse(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function useAvisos() {
  return useSyncExternalStore(suscribirse, () => estado);
}
