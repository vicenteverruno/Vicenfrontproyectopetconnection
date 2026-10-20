import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Comentarios.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { useMascotas } from "../hooks/useMascotas";
import { useComentarios } from "../hooks/useComentarios";

function IconoVerificado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#2e7d32" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoEnviar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function Comentarios() {
  const { id } = useParams();
  const mascotas = useMascotas();
  const mascota = mascotas.find((m) => m.id === Number(id));
  const { comentarios, agregarComentario } = useComentarios(id);
  const [fotoActual, setFotoActual] = useState(0);
  const [texto, setTexto] = useState("");
  const listaRef = useRef(null);

  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [comentarios.length]);

  if (!mascota) {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar volverA="/buscar" />
          <div className="cm-contenido">
            <p>No encontramos esta mascota.</p>
          </div>
        </div>
      </div>
    );
  }

  const total = mascota.fotos.length;
  const anterior = () => setFotoActual((a) => (a === 0 ? total - 1 : a - 1));
  const siguiente = () => setFotoActual((a) => (a === total - 1 ? 0 : a + 1));
  const miniaturas = mascota.fotos.slice(0, 6);

  const enviar = (e) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    agregarComentario(limpio);
    setTexto("");
  };

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar volverA={`/mascota/${mascota.id}`} />

        <div className="cm-contenido">
          <div className="cm-cabecera">
            <img src={mascota.fotos[0]} alt={mascota.nombre} />
            <div>
              <strong>
                {mascota.nombre} <IconoVerificado />
              </strong>
              <p>
                {mascota.raza} · Publicado por {mascota.dueno}
              </p>
            </div>
          </div>

          <div className="cm-cuerpo">
            <div className="cm-galeria">
              <div className="cm-foto">
                {total > 1 && (
                  <button type="button" className="cm-flecha izq" onClick={anterior}>‹</button>
                )}
                <img src={mascota.fotos[fotoActual]} alt={mascota.nombre} />
                {total > 1 && (
                  <button type="button" className="cm-flecha der" onClick={siguiente}>›</button>
                )}
              </div>

              <div className="cm-miniaturas">
                {miniaturas.map((foto, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`cm-mini ${index === fotoActual ? "activa" : ""}`}
                    onClick={() => setFotoActual(index)}
                  >
                    <img src={foto} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="cm-lista" ref={listaRef}>
              {comentarios.length === 0 ? (
                <p className="cm-vacio">Todavía no hay comentarios. ¡Escribí el primero!</p>
              ) : (
                comentarios.map((c) => (
                  <div key={c.id} className="cm-burbuja">
                    <p>{c.texto}</p>
                    <span>{c.hora}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <form className="cm-form" onSubmit={enviar}>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribí un mensaje..."
              maxLength={200}
            />
            <button type="submit" className="cm-enviar" disabled={!texto.trim()}>
              <IconoEnviar />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comentarios;