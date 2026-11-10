import { useEffect, useSyncExternalStore } from "react";
import { apiFetch, obtenerIdUsuario } from "../api";
import { useMisMascotas } from "./useMiMascota";

const claveVistas = (usuario) => `petconnection_notificaciones_vistas_${usuario}`;
const oyentes = new Set();
let estado = { lista: [], vistas: [] };
let pedidoEnCurso = null;

function publicar(cambios) {
  estado = { ...estado, ...cambios };
  oyentes.forEach((avisar) => avisar());
}

function leerVistas() {
  try {
    return JSON.parse(localStorage.getItem(claveVistas(obtenerIdUsuario()))) ?? [];
  } catch {
    return [];
  }
}

// El back guarda solo la fecha (sin hora), por eso no se puede decir "hace 5 min"
function tiempoDesde(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const dias = Math.round((inicioHoy - new Date(anio, mes - 1, dia)) / 86400000);

  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
}

async function pedirJson(ruta) {
  const response = await apiFetch(ruta);
  return response.ok ? response.json() : [];
}

const soloFecha = (fecha) => String(fecha).slice(0, 10);

async function notificacionesDeMascota(idMascota, nombres) {
  const [likes, comentarios] = await Promise.all([
    pedirJson(`/like/${idMascota}`),
    pedirJson(`/comentario/${idMascota}`),
  ]);
  const miNombre = nombres[idMascota] || "tu mascota";

  const deLikes = likes.map((l) => ({
    id: `like-${l.id_like}`,
    tipo: "like",
    titulo: "Le gustaste a alguien",
    descripcion: `A ${nombres[l.id_mascota_1] || "una mascota"} le gustó el perfil de ${miNombre}`,
    fecha: soloFecha(l.fecha),
  }));

  const deComentarios = comentarios
    .filter((c) => c.id_mascota_1 !== idMascota)
    .map((c) => ({
      id: `comentario-${c.id_comentario}`,
      tipo: "comentario",
      titulo: `${nombres[c.id_mascota_1] || "Alguien"} comentó a ${miNombre}`,
      descripcion: c.texto,
      fecha: soloFecha(c.fecha),
    }));

  // Hay match si esta mascota también le dio like a alguna de las que le dieron like
  const deMatches = (
    await Promise.all(
      likes.map(async (l) => {
        const recibidosPorLaOtra = await pedirJson(`/like/${l.id_mascota_1}`);
        const devuelto = recibidosPorLaOtra.find((r) => r.id_mascota_1 === idMascota);
        if (!devuelto) return null;

        const fechas = [soloFecha(l.fecha), soloFecha(devuelto.fecha)].sort();
        return {
          id: `match-${[idMascota, l.id_mascota_1].sort((a, b) => a - b).join("-")}`,
          tipo: "match",
          titulo: "¡Es un match!",
          descripcion: `A ${miNombre} y a ${nombres[l.id_mascota_1] || "otra mascota"} les gustaron sus perfiles`,
          fecha: fechas[1],
        };
      })
    )
  ).filter(Boolean);

  return [...deMatches, ...deLikes, ...deComentarios];
}

async function pedirNotificaciones(ids) {
  try {
    const mascotas = await pedirJson("/mascota");
    const nombres = {};
    mascotas.forEach((m) => {
      nombres[m.id_mascota] = (m.nombre || "").trim();
    });

    const porMascota = await Promise.all(ids.map((id) => notificacionesDeMascota(id, nombres)));
    const sinRepetir = new Map(porMascota.flat().map((n) => [n.id, n]));

    const lista = [...sinRepetir.values()]
      .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0))
      .map((n) => ({ ...n, tiempo: tiempoDesde(n.fecha), esDeHoy: tiempoDesde(n.fecha) === "Hoy" }));

    publicar({ lista, vistas: leerVistas() });
  } catch (error) {
    console.error("No se pudo conectar con el servidor:", error);
  }
}

function refrescar(claveIds) {
  if (!claveIds) {
    publicar({ lista: [], vistas: [] });
    return;
  }

  if (pedidoEnCurso?.claveIds === claveIds) return;

  const pedido = { claveIds };
  pedidoEnCurso = pedido;
  pedirNotificaciones(claveIds.split(",").map(Number)).finally(() => {
    if (pedidoEnCurso === pedido) pedidoEnCurso = null;
  });
}

export function marcarVistas() {
  const nuevas = estado.lista.filter((n) => !estado.vistas.includes(n.id));
  if (nuevas.length === 0) return;

  const vistas = estado.lista.map((n) => n.id);
  try {
    localStorage.setItem(claveVistas(obtenerIdUsuario()), JSON.stringify(vistas));
  } catch {
    // Si el navegador se queda sin espacio, no rompemos la página
  }
  publicar({ vistas });
}

function suscribirse(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function useNotificaciones() {
  const { mascotas } = useMisMascotas();
  const { lista, vistas } = useSyncExternalStore(suscribirse, () => estado);
  const claveIds = mascotas.map((m) => m.idMascota).join(",");

  useEffect(() => {
    refrescar(claveIds);
  }, [claveIds]);

  return {
    notificaciones: lista,
    hayNuevas: lista.some((n) => !vistas.includes(n.id)),
  };
}
