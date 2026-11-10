// Devuelve el id del usuario logueado, que viene dentro del token
export function obtenerIdUsuario() {
  try {
    const parte = localStorage.getItem("token").split(".")[1];
    const base64 = parte.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)).id ?? null;
  } catch {
    return null;
  }
}

export function apiFetch(ruta, opciones = {}) {
  const token = localStorage.getItem("token");
 
  return fetch(`${import.meta.env.VITE_API_URL}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  });
}