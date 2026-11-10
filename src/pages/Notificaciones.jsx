// ============================================================
// Notificaciones.jsx. Reemplaza al tuyo en src/pages/
// No hace falta tocar el back: usa los endpoints que ya tenés.
//
// Resumen de cambios (el diseño / las clases CSS NO cambian):
//  - SACADO: import de notificacionesEjemplo (las hardcodeadas)
//  - AGREGADO: imports de useState, useEffect, apiFetch y useMiMascota
//  - AGREGADO: pedir al back 3 cosas cuando entrás a la pantalla:
//      GET /like/<id de tu mascota>         -> likes que recibió tu mascota
//      GET /comentario/<id de tu mascota>   -> comentarios que recibió tu mascota
//      GET /mascota                         -> para saber el nombre de la mascota
//                                              que dio el like o comentó
//  - AGREGADO: tiempoDesde (convierte la fecha en "Hoy", "Ayer", "Hace 3 días")
//  - CAMBIADO: el texto de cada notificación se arma con esos datos
// ============================================================

import { useState, useEffect } from "react"; // AGREGADO
import "./Notificaciones.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { apiFetch } from "../api"; // AGREGADO
import { useMiMascota } from "../hooks/useMiMascota"; // AGREGADO
// SACADO: import { notificacionesEjemplo } from "../data/notificaciones";

const iconosPorTipo = {
  match: "❤️",
  like: "❤️",
  comentario: "💬",
};

// AGREGADO: el back guarda solo la fecha (sin hora), por eso no se puede decir "hace 5 min"
function tiempoDesde(fecha) {
  const [anio, mes, dia] = String(fecha).slice(0, 10).split("-").map(Number);
  const hoy = new Date();
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const dias = Math.round((inicioHoy - new Date(anio, mes - 1, dia)) / 86400000);

  if (dias <= 0) return "Hoy";
  if (dias === 1) return "Ayer";
  return `Hace ${dias} días`;
}

function Notificaciones() {
  const [miMascota] = useMiMascota(); // AGREGADO: para saber el id de TU mascota
  const [notificaciones, setNotificaciones] = useState([]); // AGREGADO
  const idMiMascota = miMascota.idMascota;

  // AGREGADO: al entrar a la pantalla, pide los datos al back y arma la lista
  useEffect(() => {
    if (!idMiMascota) return; // sin mascota publicada no hay notificaciones

    async function cargar() {
      try {
        const [resLikes, resComentarios, resMascotas] = await Promise.all([
          apiFetch(`/like/${idMiMascota}`),
          apiFetch(`/comentario/${idMiMascota}`),
          apiFetch("/mascota"),
        ]);

        const likes = resLikes.ok ? await resLikes.json() : [];
        const comentarios = resComentarios.ok ? await resComentarios.json() : [];
        const mascotas = resMascotas.ok ? await resMascotas.json() : [];

        // id de mascota -> nombre (para saber quién dio el like o comentó)
        const nombres = {};
        mascotas.forEach((m) => {
          nombres[m.id_mascota] = (m.nombre || "").trim();
        });

        const deLikes = likes.map((l) => ({
          id: `like-${l.id_like}`,
          tipo: "like",
          titulo: "Le gustaste a alguien",
          descripcion: `A ${nombres[l.id_mascota_1] || "una mascota"} le gustó el perfil de tu mascota`,
          fecha: String(l.fecha).slice(0, 10),
        }));

        const deComentarios = comentarios.map((c) => ({
          id: `comentario-${c.id_comentario}`,
          tipo: "comentario",
          titulo: `${nombres[c.id_mascota_1] || "Alguien"} comentó tu mascota`,
          descripcion: c.texto,
          fecha: String(c.fecha).slice(0, 10),
        }));

        // Las más nuevas primero
        const todas = [...deLikes, ...deComentarios].sort((a, b) =>
          a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0
        );

        setNotificaciones(
          todas.map((n) => ({
            ...n,
            tiempo: tiempoDesde(n.fecha),
            esDeHoy: tiempoDesde(n.fecha) === "Hoy",
          }))
        );
      } catch (error) {
        console.error("No se pudo conectar con el servidor:", error);
      }
    }

    cargar();
  }, [idMiMascota]);

  // ---------- LO DE ABAJO ES IGUAL A TU ARCHIVO (salvo lo marcado) ----------
  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />
        <div className="notificaciones-content">
          <h1>Notificaciones</h1>
          <p className="notificaciones-subtitle">
            {/* CAMBIADO: antes usaba notificacionesEjemplo.length */}
            {notificaciones.length === 0
              ? "Todavía no tenés notificaciones"
              : `Tenés ${notificaciones.length} ${notificaciones.length === 1 ? "notificación" : "notificaciones"}`}
          </p>

          <div className="notificaciones-list">
            {/* CAMBIADO: antes recorría notificacionesEjemplo */}
            {notificaciones.map((n) => (
              <div key={n.id} className="notificacion-card">
                <span className="notificacion-icono">{iconosPorTipo[n.tipo]}</span>

                <div className="notificacion-texto">
                  <strong>{n.titulo}</strong>
                  <p>{n.descripcion}</p>
                </div>

                <div className="notificacion-meta">
                  <span>{n.tiempo}</span>
                  {/* CAMBIADO: el punto solo aparece en las notificaciones de hoy */}
                  {n.esDeHoy && <span className="notificacion-punto"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notificaciones;