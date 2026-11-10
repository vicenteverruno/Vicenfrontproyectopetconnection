import { useEffect, useState } from "react";
import { apiFetch } from "../api";

const cache = new Map();

function pedirUsuario(id) {
  if (!cache.has(id)) {
    const pedido = apiFetch(`/usuario/${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((usuario) => {
        if (!usuario) cache.delete(id); // Si falló, se vuelve a intentar la próxima vez
        return usuario;
      });
    cache.set(id, pedido);
  }

  return cache.get(id);
}

export function useUsuario(id) {
  const [resultado, setResultado] = useState({ id: null, usuario: null });

  useEffect(() => {
    if (id == null) return;
    let cancelado = false;

    pedirUsuario(id).then((usuario) => {
      if (!cancelado) setResultado({ id, usuario });
    });

    return () => {
      cancelado = true;
    };
  }, [id]);

  const cargado = resultado.id === id;
  return { usuario: cargado ? resultado.usuario : null, cargado };
}
