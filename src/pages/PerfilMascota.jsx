import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./PerfilMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { IconoTelefono, IconoMensaje } from "../components/Iconos";
import { useMascotas } from "../hooks/useMascotas";
import { useFavoritos } from "../hooks/useFavoritos";

function IconoCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconoEquis() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CorazonGuardar({ activo }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={activo ? "#dc2626" : "none"} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PerfilMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mascotas = useMascotas();
  const mascota = mascotas.find((m) => m.id === Number(id));
  const [fotoActual, setFotoActual] = useState(0);
  const { esFavorito, toggleFavorito } = useFavoritos();

  if (!mascota) {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar volverA="/buscar" />
          <div className="pf-contenido">
            <p>No encontramos esta mascota.</p>
            <Link to="/buscar" className="pf-volver">‹ Volver a buscar</Link>
          </div>
        </div>
      </div>
    );
  }

  const total = mascota.fotos.length;
  const guardada = esFavorito(mascota.id);

  const anterior = () => setFotoActual((a) => (a === 0 ? total - 1 : a - 1));
  const siguiente = () => setFotoActual((a) => (a === total - 1 ? 0 : a + 1));

  const miniaturas = mascota.fotos.slice(0, 6);
  const restantes = total - miniaturas.length;

  const salud = mascota.salud;
  const todoOk = Object.values(salud).every(Boolean);

  const filas = [
    ["Edad", mascota.edad],
    ["Sexo", mascota.sexo],
    ["Peso", mascota.peso],
    ["Tamaño", mascota.tamano],
    ["Color", mascota.color],
    ["Ubicación", mascota.ubicacion],
  ].filter(([, valor]) => valor);

  const itemsSalud = [
    { titulo: "Vacunas", ok: salud.vacunas, siTexto: "Al día", noTexto: "Pendiente" },
    { titulo: "Desparasitación", ok: salud.desparasitacion, siTexto: "Al día", noTexto: "Pendiente" },
    { titulo: "Enfermedades genéticas", ok: salud.enfermedadesGeneticas, siTexto: "Sin antecedentes", noTexto: "Con antecedentes" },
    { titulo: "Certificado de salud", ok: salud.certificadoSalud, siTexto: "Vigente", noTexto: "Vencido" },
  ];

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar volverA="/buscar" />

        <div className="pf-contenido">
          <div className="pf-grid">
            <div className="pf-galeria">
              <div className="pf-foto">
                {total > 1 && (
                  <button type="button" className="pf-flecha izq" onClick={anterior}>‹</button>
                )}
                <img src={mascota.fotos[fotoActual]} alt={mascota.nombre} />
                {total > 1 && (
                  <button type="button" className="pf-flecha der" onClick={siguiente}>›</button>
                )}
              </div>

              <div className="pf-miniaturas">
                {miniaturas.map((foto, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`pf-mini ${index === fotoActual ? "activa" : ""}`}
                    onClick={() => setFotoActual(index)}
                  >
                    <img src={foto} alt="" />
                    {index === miniaturas.length - 1 && restantes > 0 && (
                      <span className="pf-mini-mas">+{restantes}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pf-acciones">
                <button type="button" className="pf-accion" onClick={() => toggleFavorito(mascota.id)}>
                  <CorazonGuardar activo={guardada} /> Guardar
                </button>
                <button
                  type="button"
                  className="pf-accion comentar"
                  onClick={() => navigate(`/mascota/${mascota.id}/comentarios`)}
                >
                  <IconoMensaje /> Comentar
                </button>
              </div>
            </div>

            <div className="pf-datos">
              <h1>{mascota.nombre}</h1>
              <p className="pf-raza">{mascota.raza}</p>

              {filas.map(([label, valor]) => (
                <div key={label} className="pf-fila">
                  <span>{label}</span>
                  <strong>{valor}</strong>
                </div>
              ))}

              {mascota.telefono && (
                <div className="pf-contacto">
                  <p className="pf-contacto-titulo">Contacto del dueño</p>
                  <div className="pf-contacto-fila">
                    <span><IconoTelefono /> {mascota.telefono}</span>
                    <a href={`tel:${mascota.telefono}`}>Llamar</a>
                  </div>
                </div>
              )}

              {mascota.descripcion && (
                <div className="pf-descripcion">
                  <p className="pf-descripcion-titulo">Sobre {mascota.nombre}</p>
                  <p>{mascota.descripcion}</p>
                </div>
              )}
            </div>

            <div className="pf-salud">
              <h3>Salud</h3>

              {todoOk && (
                <div className="pf-salud-banner">
                  <strong><IconoCheck /> Salud verificada</strong>
                  <p>Controles y documentación al día.</p>
                </div>
              )}

              <div className="pf-salud-grid">
                {itemsSalud.map((item) => (
                  <div key={item.titulo} className="pf-salud-item">
                    <strong>
                      {item.ok ? <IconoCheck /> : <IconoEquis />} {item.titulo}
                    </strong>
                    <p>{item.ok ? item.siTexto : item.noTexto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilMascota;