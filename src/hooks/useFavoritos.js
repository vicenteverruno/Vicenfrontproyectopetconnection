import { useEffect, useSyncExternalStore } from "react";
import { apiFetch } from "../api";
import { useMiMascota } from "./useMiMascota";

// Los favoritos de cada mascota son los likes que dio, guardados en la base de datos
const SIN_FAVORITOS = [];
const favoritosPorMascota = new Map();
const sincronizadas = new Set();
const pedidosEnCurso = new Map();
const oyentes = new Set();

const leer = (idMascota) => favoritosPorMascota.get(idMascota) ?? SIN_FAVORITOS;

function publicar(idMascota, lista) {
  favoritosPorMascota.set(idMascota, lista);
  oyentes.forEach((avisar) => avisar());
}

async function pedirJson(ruta) {
  const response = await apiFetch(ruta);
  if (!response.ok) throw new Error(`Falló GET ${ruta}`);
  return response.json();
}

// El back solo informa los likes que recibe cada mascota, así que se revisan las demás
async function pedirFavoritos(idMascota) {
  const mascotas = await pedirJson("/mascota");
  const otras = mascotas.map((m) => m.id_mascota).filter((id) => id !== idMascota);

  const resultados = await Promise.all(
    otras.map(async (id) => {
      const likesRecibidos = await pedirJson(`/like/${id}`);
      return likesRecibidos.some((like) => like.id_mascota_1 === idMascota) ? id : null;
    })
  );

  return resultados.filter((id) => id !== null);
}

function sincronizar(idMascota) {
  if (idMascota == null || sincronizadas.has(idMascota) || pedidosEnCurso.has(idMascota)) return;

  const pedido = { huboCambios: false };
  pedidosEnCurso.set(idMascota, pedido);

  pedirFavoritos(idMascota)
    .then((lista) => {
      pedidosEnCurso.delete(idMascota);

      // Si dio o sacó un like mientras cargaba, esta lista puede estar desactualizada
      if (pedido.huboCambios) {
        sincronizar(idMascota);
        return;
      }

      sincronizadas.add(idMascota);
      publicar(idMascota, lista);
    })
    .catch((error) => {
      pedidosEnCurso.delete(idMascota);
      console.error("No se pudieron cargar los favoritos:", error);
    });
}

function suscribirse(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function useFavoritos() {
  const [miMascota] = useMiMascota();
  const idMiMascota = miMascota.idMascota;
  const favoritos = useSyncExternalStore(suscribirse, () => leer(idMiMascota));

  useEffect(() => {
    sincronizar(idMiMascota);
  }, [idMiMascota]);

  const esFavorito = (id) => favoritos.includes(id);

  // Se llama cuando el back ya confirmó el cambio del like
  const toggleFavorito = (id) => {
    if (idMiMascota == null) return;

    const pedido = pedidosEnCurso.get(idMiMascota);
    if (pedido) pedido.huboCambios = true;

    const actual = leer(idMiMascota);
    publicar(idMiMascota, actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]);
  };

  return { favoritos, esFavorito, toggleFavorito };
}
