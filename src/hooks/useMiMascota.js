import { useState, useEffect } from "react";
import { miMascotaInicial } from "../data/miMascota";

const CLAVE = "petconnection_mi_mascota";

function leerMascota() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? { ...miMascotaInicial, ...JSON.parse(guardado) } : miMascotaInicial;
  } catch {
    return miMascotaInicial;
  }
}

export function useMiMascota() {
  const [mascota, setMascota] = useState(leerMascota);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(mascota));
    } catch {
      // Si el navegador se queda sin espacio, no rompemos la página
    }
  }, [mascota]);

  return [mascota, setMascota];
}