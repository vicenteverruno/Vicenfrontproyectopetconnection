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