import { useSyncExternalStore } from "react";
import { useMiMascota } from "./useMiMascota";

// Los favoritos son de cada mascota: así no se mezclan entre mascotas ni entre cuentas
const clave = (idMascota) => `petconnection_favoritos_mascota_${idMascota}`;
const SIN_FAVORITOS = [];
const cache = new Map();
const oyentes = new Set();

function leer(idMascota) {
  if (idMascota == null) return SIN_FAVORITOS;

  if (!cache.has(idMascota)) {
    let lista = SIN_FAVORITOS;
    try {
      lista = JSON.parse(localStorage.getItem(clave(idMascota))) ?? SIN_FAVORITOS;
    } catch {
      // Si lo guardado está roto, arrancamos sin favoritos
    }
    cache.set(idMascota, lista);
  }

  return cache.get(idMascota);
}

function escribir(idMascota, lista) {
  cache.set(idMascota, lista);
  try {
    localStorage.setItem(clave(idMascota), JSON.stringify(lista));
  } catch {
    // Si el navegador se queda sin espacio, no rompemos la página
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribirse(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function useFavoritos() {
  const [miMascota] = useMiMascota();
  const idMiMascota = miMascota.idMascota;
  const favoritos = useSyncExternalStore(suscribirse, () => leer(idMiMascota));

  const esFavorito = (id) => favoritos.includes(id);

  const toggleFavorito = (id) => {
    if (idMiMascota == null) return;
    const actual = leer(idMiMascota);
    escribir(idMiMascota, actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]);
  };

  return { favoritos, esFavorito, toggleFavorito };
}
