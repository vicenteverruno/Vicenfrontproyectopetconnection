import { useEffect, useSyncExternalStore } from "react";
import { apiFetch, obtenerIdUsuario } from "../api";
import { avisar } from "../avisos";
import { miMascotaInicial } from "../data/miMascota";

// El back acepta hasta 5 imágenes por pedido
export const MAX_FOTOS = 5;

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

// Fotos viejas que quedaron en este navegador y todavía no se subieron al back.
// Antes había una sola mascota por navegador: si esa mascota es de este usuario, sus fotos pasan al formato nuevo.
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
    fotos: fila.imagenes?.length ? fila.imagenes : (fotos[fila.id_mascota] || []).slice(0, MAX_FOTOS),
  };
}

// Las fotos que todavía no se subieron son data URLs; las del back ya son links
export const esFotoSinSubir = (foto) => foto.startsWith("data:");

async function armarCuerpo(campos, fotosNuevas) {
  if (fotosNuevas.length === 0) return JSON.stringify(campos);

  const formulario = new FormData();
  Object.entries(campos).forEach(([campo, valor]) => formulario.append(campo, valor ?? ""));

  for (const [indice, foto] of fotosNuevas.entries()) {
    const archivo = await (await fetch(foto)).blob();
    formulario.append("imagenes", archivo, `foto-${indice + 1}.jpg`);
  }

  return formulario;
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
      body: await armarCuerpo(
        {
          nombre: datos.nombre,
          especie: datos.especie,
          raza: datos.raza,
          sexo: datos.sexo,
          nacimiento: datos.fechaNacimiento,
          tamaño: datos.tamano,
          color: datos.color,
          ubicacion: datos.ubicacion,
          descripcion: datos.descripcion,
        },
        datos.fotos.filter(esFotoSinSubir)
      ),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) throw new Error("Tu sesión venció. Iniciá sesión de nuevo.");
  if (response.status >= 500) throw new Error("Hubo un problema en el servidor. Probá de nuevo.");
  if (!response.ok) throw new Error(data.message || "No se pudo guardar la mascota");

  const usuario = estado.usuario;
  const idMascota = creando ? data.id : datos.idMascota;

  // Las fotos ya quedaron en el back: se borra la copia local y se vuelven a pedir para tener sus links
  const fotos = leerJson(claveFotos(usuario), {});
  delete fotos[idMascota];
  escribir(claveFotos(usuario), fotos);

  if (creando) escribir(claveActiva(usuario), idMascota);
  await cargar(usuario);
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
