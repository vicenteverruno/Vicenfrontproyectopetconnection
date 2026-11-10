import { useState, useEffect, useMemo } from "react"; // AGREGADO
import { apiFetch } from "../api"; // AGREGADO
import { useMiMascota } from "./useMiMascota";
 
// ---------- SIN CAMBIOS ----------
export function calcularEdad(texto) {
  const t = (texto || "").trim();
  const partes = t.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/) || t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
 
  if (!partes) return t;
 
  let nacimiento;
  if (partes[1].length === 4) {
    nacimiento = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  } else {
    nacimiento = new Date(Number(partes[3]), Number(partes[2]) - 1, Number(partes[1]));
  }
 
  if (Number.isNaN(nacimiento.getTime())) return t;
 
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  if (meses < 0) return t;
 
  if (meses < 12) return meses === 1 ? "1 mes" : `${meses} meses`;
  const anios = Math.floor(meses / 12);
  return anios === 1 ? "1 año" : `${anios} años`;
}
 
function capitalizar(texto) {
  const t = (texto || "").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}
 
// ---------- CAMBIADO ----------
// Antes: miMascotaAMascota(m) convertía solo TU mascota.
// Ahora: filaAMascota convierte CUALQUIER mascota que viene de la base de datos
// al formato que ya usan tus pantallas (id, nombre, raza, edad, etc.).
function filaAMascota(m, idMiMascota) {
  const esMia = idMiMascota != null && Number(m.id_mascota) === Number(idMiMascota);
  // El back manda la fecha como "2022-05-10T00:00:00.000Z": nos quedamos con "2022-05-10"
  const nacimiento = String(m.nacimiento || "").slice(0, 10);
 
  return {
    id: m.id_mascota,
    esMia,
    especie: m.especie,
    nombre: (m.nombre || "").trim(),
    dueno: esMia ? "vos" : "otro usuario",
    idDueno: m.id_usuario,
    raza: capitalizar(m.raza),
    edad: calcularEdad(nacimiento),
    sexo: (m.sexo || "").toLowerCase().includes("hembra") ? "Hembra" : "Macho",
    tamano: capitalizar(m["tamaño"]),
    color: capitalizar(m.color),
    ubicacion: m.ubicacion,
    descripcion: m.descripcion,
    // Datos que todavía no existen en el back: quedan vacíos para que nada se rompa
    peso: "",
    salud: {},
    // Las fotos no se guardan en la base de datos (por ahora)
    fotos: [],
  };
}
 
// ---------- CAMBIADO ----------
// Antes: devolvía tu mascota + mascotasEjemplo (hardcodeadas).
// Ahora: pide las mascotas al back (GET /mascota) y las devuelve.
// Acepta filtros opcionales: { especie, sexo, tamano } que se mandan al back.
export function useMascotas(filtros = {}) {
  const [miMascota] = useMiMascota();
  const [filas, setFilas] = useState([]);
 
  const params = new URLSearchParams();
  if (filtros.especie) params.set("especie", filtros.especie);
  if (filtros.sexo) params.set("sexo", filtros.sexo);
  if (filtros.tamano) params.set("tamaño", filtros.tamano);
  const queryString = params.toString();
 
  useEffect(() => {
    let cancelado = false;
 
    async function cargar() {
      try {
        const response = await apiFetch(`/mascota${queryString ? `?${queryString}` : ""}`);
        const data = await response.json();
 
        if (!response.ok) {
          console.error("Error al obtener mascotas:", data.message);
          return;
        }
 
        if (!cancelado) setFilas(data);
      } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
      }
    }
 
    cargar();
    return () => {
      cancelado = true;
    };
  }, [queryString]);
 
  const idMiMascota = miMascota.idMascota;
 
  return useMemo(() => {
    const lista = filas.map((fila) => filaAMascota(fila, idMiMascota));
    // Tu mascota aparece primero, como antes
    return [...lista.filter((m) => m.esMia), ...lista.filter((m) => !m.esMia)];
  }, [filas, idMiMascota]);
}
 