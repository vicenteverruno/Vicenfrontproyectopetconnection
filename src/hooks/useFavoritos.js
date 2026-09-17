import { useState, useEffect } from "react";

const CLAVE = "petconnection_favoritos";

function leerFavoritos() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(leerFavoritos);

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(favoritos));
  }, [favoritos]);

  const esFavorito = (id) => favoritos.includes(id);

  const toggleFavorito = (id) => {
    setFavoritos((actual) =>
      actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]
    );
  };

  return { favoritos, esFavorito, toggleFavorito };
}