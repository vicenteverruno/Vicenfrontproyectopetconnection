import { useSyncExternalStore } from "react";

const CLAVE = "petconnection_notificaciones";
const oyentes = new Set();

function leer() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

let notificaciones = leer();

function guardar(nuevas) {
  notificaciones = nuevas;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(nuevas));
  } catch {
    // si el navegador no tiene espacio, seguimos igual
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribirse(avisar) {
  oyentes.add(avisar);

  const alCambiarOtraPestana = (e) => {
    if (e.key === CLAVE) {
      notificaciones = leer();
      avisar();
    }
  };
  window.addEventListener("storage", alCambiarOtraPestana);

  return () => {
    oyentes.delete(avisar);
    window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

function obtener() {
  return notificaciones;
}

export function agregarNotificacion({ tipo, titulo, descripcion, link }) {
  const nueva = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo,
    titulo,
    descripcion,
    link: link || null,
    creadaEn: new Date().toISOString(),
    leida: false,
  };
  guardar([nueva, ...notificaciones].slice(0, 50));
}

export function marcarLeida(id) {
  guardar(notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)));
}

export function marcarTodasLeidas() {
  if (notificaciones.some((n) => !n.leida)) {
    guardar(notificaciones.map((n) => ({ ...n, leida: true })));
  }
}

export function useNotificaciones() {
  const lista = useSyncExternalStore(suscribirse, obtener);
  const noLeidas = lista.filter((n) => !n.leida).length;
  return { notificaciones: lista, noLeidas };
}