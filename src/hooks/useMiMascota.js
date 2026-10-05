import { useState, useEffect } from "react";
import { miMascotaInicial } from "../data/miMascota";

const CLAVE = "petconnection_mi_mascota";

function leerMascota() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : miMascotaInicial;
  } catch {
    return miMascotaInicial;
  }
}

export function useMiMascota() {
  const [mascota, setMascota] = useState(leerMascota);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(mascota));
  }, [mascota]);

  return [mascota, setMascota];
}