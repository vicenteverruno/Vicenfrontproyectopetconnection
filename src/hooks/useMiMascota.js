import { useState, useEffect } from "react";
import { miMascotaInicial } from "../data/miMascota";

const CLAVE = "petconnection_mi_mascota";

function leerMascota() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado
      ? { ...miMascotaInicial, ...JSON.parse(guardado) }
      : miMascotaInicial;
  } catch {
    return miMascotaInicial;
  }
}

// Obtiene el ID del usuario a partir del token
function obtenerIdUsuario(token) {
  try {
    const parte = token.split(".")[1];
    const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    return payload.id;
  } catch {
    return null;
  }
}

export function useMiMascota() {
  const [mascota, setMascota] = useState(leerMascota);

  // Recuperar la mascota desde el backend
  useEffect(() => {
    async function cargarMascota() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const idUsuario = obtenerIdUsuario(token);

      if (!idUsuario) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/mascota`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener las mascotas");
        }

        const mascotas = await response.json();

        // Buscar la mascota que pertenece al usuario
        const miMascotaDB = mascotas.find(
          (m) => String(m.id_usuario) === String(idUsuario)
        );

        if (miMascotaDB) {
          setMascota((prev) => ({
            ...prev,
            idMascota: miMascotaDB.id_mascota,
            nombre: miMascotaDB.nombre,
            especie: miMascotaDB.especie,
            raza: miMascotaDB.raza,
            sexo: miMascotaDB.sexo,
            fechaNacimiento: miMascotaDB.nacimiento
              ? String(miMascotaDB.nacimiento).slice(0, 10)
              : "",
            tamano: miMascotaDB.tamaño,
            color: miMascotaDB.color,
            ubicacion: miMascotaDB.ubicacion,
            descripcion: miMascotaDB.descripcion || "",
            publicada: true
          }));
        } else {
          // El usuario todavía no tiene una mascota publicada
          setMascota((prev) => ({
            ...prev,
            publicada: false,
            idMascota: null
          }));
        }

      } catch (error) {
        console.error("Error al recuperar mi mascota:", error);
      }
    }

    cargarMascota();
  }, []);

  // Guardar los cambios en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(mascota));
    } catch {
      // Si el navegador se queda sin espacio, no rompemos la página
    }
  }, [mascota]);

  return [mascota, setMascota];
}