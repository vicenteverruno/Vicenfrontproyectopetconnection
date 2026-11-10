import { useEffect, useSyncExternalStore } from "react";
import { apiFetch, obtenerIdUsuario } from "../api";
import { avisar } from "../avisos";
import { miMascotaInicial } from "../data/miMascota";

const CLAVE_VIEJA = "petconnection_mi_mascota";
const claveFotos = (usuario) => `petconnection_fotos_${usuario}`;
const claveActiva = (usuario) => `petconnection_mascota_activa_${usuario}`;

const oyentes = new Set();
let estado = { usuario: null, mascotas: [], idActiva: null, cargado: false };

function publicar(cambios) {
  estado = { ...estado, ...cambios };
  oyentes.forEach((avisarOyente) => avisarOyente());
}

function leerJson(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Si el navegador se queda sin espacio, no rompemos la página
  }
}

// Las fotos no se guardan en el back. Antes había una sola mascota por navegador:
// si esa mascota es de este usuario, sus fotos pasan al formato nuevo.
function leerFotos(usuario, filas) {
  const fotos = leerJson(claveFotos(usuario), {});
  const vieja = leerJson(CLAVE_VIEJA, null);

  if (vieja?.idMascota && filas.some((f) => f.id_mascota === vieja.idMascota)) {
    fotos[vieja.idMascota] = fotos[vieja.idMascota] || vieja.fotos || [];
    escribir(claveFotos(usuario), fotos);
    localStorage.removeItem(CLAVE_VIEJA);
  }

  return fotos;
}

const limpiar = (texto) => (texto || "").trim();

function filaAMiMascota(fila, fotos) {
  return {
    ...miMascotaInicial,
    idMascota: fila.id_mascota,
    nombre: limpiar(fila.nombre),
    especie: limpiar(fila.especie),
    raza: limpiar(fila.raza),
    sexo: limpiar(fila.sexo),
    fechaNacimiento: fila.nacimiento ? String(fila.nacimiento).slice(0, 10) : "",
    tamano: limpiar(fila.tamaño),
    color: limpiar(fila.color),
    ubicacion: limpiar(fila.ubicacion),
    descripcion: limpiar(fila.descripcion),
    publicada: true,
    fotos: fotos[fila.id_mascota] || [],
  };
}

async function cargar(usuario) {
  try {
    const response = await apiFetch("/mascota");
    if (!response.ok) throw new Error("No se pudieron obtener las mascotas");

    const filas = await response.json();
    if (usuario !== estado.usuario) return; // Cambió de cuenta mientras cargaba

    const propias = filas
      .filter((f) => String(f.id_usuario) === String(usuario))
      .sort((a, b) => a.id_mascota - b.id_mascota);
    const fotos = leerFotos(usuario, propias);
    const mascotas = propias.map((fila) => filaAMiMascota(fila, fotos));
    const guardada = leerJson(claveActiva(usuario), null);
    const idActiva = mascotas.some((m) => m.idMascota === guardada)
      ? guardada
      : (mascotas[0]?.idMascota ?? null);

    publicar({ mascotas, idActiva, cargado: true });
  } catch (error) {
    console.error("Error al recuperar mis mascotas:", error);
    avisar("No pudimos cargar tus mascotas. Probá iniciar sesión de nuevo.");
    // Sin usuario cargado, se reintenta al abrir otra pantalla (por ejemplo, después de volver a iniciar sesión)
    if (usuario === estado.usuario) publicar({ usuario: null, cargado: true });
  }
}

function asegurarCarga() {
  const usuario = obtenerIdUsuario();
  if (usuario === estado.usuario) return;

  publicar({ usuario, mascotas: [], idActiva: null, cargado: false });
  if (usuario) cargar(usuario);
}

export function elegirActiva(idMascota) {
  escribir(claveActiva(estado.usuario), idMascota);
  publicar({ idActiva: idMascota });
}

// Crea la mascota (POST) o la edita si ya tiene id (PUT). Si falla, tira un Error con un mensaje para mostrar.
export async function guardarMascota(datos) {
  const creando = !datos.idMascota;
  let response;

  try {
    response = await apiFetch(creando ? "/mascota" : `/mascota/${datos.idMascota}`, {
      method: creando ? "POST" : "PUT",
      body: JSON.stringify({
        nombre: datos.nombre,
        especie: datos.especie,
        raza: datos.raza,
        sexo: datos.sexo,
        nacimiento: datos.fechaNacimiento,
        tamaño: datos.tamano,
        color: datos.color,
        ubicacion: datos.ubicacion,
        descripcion: datos.descripcion,
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) throw new Error("Tu sesión venció. Iniciá sesión de nuevo.");
  if (response.status >= 500) throw new Error("Hubo un problema en el servidor. Probá de nuevo.");
  if (!response.ok) throw new Error(data.message || "No se pudo guardar la mascota");

  const guardada = { ...datos, idMascota: creando ? data.id : datos.idMascota, publicada: true };
  const fotos = leerJson(claveFotos(estado.usuario), {});
  fotos[guardada.idMascota] = guardada.fotos;
  escribir(claveFotos(estado.usuario), fotos);

  publicar({
    mascotas: creando
      ? [...estado.mascotas, guardada]
      : estado.mascotas.map((m) => (m.idMascota === guardada.idMascota ? guardada : m)),
  });
  if (creando) elegirActiva(guardada.idMascota);
}

function suscribirse(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function useMisMascotas() {
  const { mascotas, idActiva, cargado } = useSyncExternalStore(suscribirse, () => estado);

  useEffect(() => {
    asegurarCarga();
  }, []);

  return {
    mascotas,
    cargado,
    activa: mascotas.find((m) => m.idMascota === idActiva) ?? null,
  };
}

// La mascota con la que el usuario da likes y comenta
export function useMiMascota() {
  const { activa } = useMisMascotas();
  return [activa ?? miMascotaInicial];
}
