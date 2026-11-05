import { mascotasEjemplo } from "../data/mascotas";
import { useMiMascota } from "./useMiMascota";
  

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

function miMascotaAMascota(m) {
  return {
    id: m.idMascota,
    esMia: true,
    especie: m.especie || "Perro",
    nombre: (m.nombre || "").trim(),
    dueno: "vos",
    raza: capitalizar(m.raza),
    edad: calcularEdad(m.fechaNacimiento),
    sexo: (m.sexo || "").toLowerCase().includes("hembra") ? "Hembra" : "Macho",
    tamano: capitalizar(m.tamano),
    color: capitalizar(m.color),
    ubicacion: m.ubicacion,
    descripcion: m.descripcion,
    telefono: m.telefono || "",
    email: m.email || "tuemail@gmail.com",
    fotos: m.fotos,
  };
}

export function useMascotas() {
  const [miMascota] = useMiMascota();
  const estaPublicada = miMascota.publicada && miMascota.fotos.length > 0;

  return estaPublicada ? [miMascotaAMascota(miMascota), ...mascotasEjemplo] : mascotasEjemplo;
}