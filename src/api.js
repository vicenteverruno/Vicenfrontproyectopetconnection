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
  // Con FormData (fotos) el navegador tiene que poner el Content-Type solo
  const esFormulario = opciones.body instanceof FormData;

  return fetch(`${import.meta.env.VITE_API_URL}${ruta}`, {
    ...opciones,
    headers: {
      ...(esFormulario ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  });
}