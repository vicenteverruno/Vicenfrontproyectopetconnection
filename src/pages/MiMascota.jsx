import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./MiMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { useMiMascota } from "../hooks/useMiMascota";
import { ID_MI_MASCOTA, calcularEdad } from "../hooks/useMascotas";
import { agregarNotificacion } from "../hooks/useNotificaciones";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoCorazon, IconoPeso, IconoTamano } from "../components/Iconos";

const MAX_FOTOS = 8;

const campos = [
  { clave: "nombre", label: "Nombre", placeholder: "Ej: Rocky" },
  { clave: "raza", label: "Raza", placeholder: "Ej: Golden Retriever" },
  { clave: "fechaNacimiento", label: "Fecha de nacimiento", placeholder: "Ej: 23/01/2019" },
  { clave: "sexo", label: "Sexo", placeholder: "Macho o Hembra" },
  { clave: "peso", label: "Peso", placeholder: "Ej: 32 kg" },
  { clave: "tamano", label: "Tamaño", placeholder: "Pequeño, mediano o grande" },
  { clave: "color", label: "Color", placeholder: "Ej: Dorado" },
  { clave: "ubicacion", label: "Ubicación", placeholder: "Ej: Palermo, CABA" },
];

function IconoCheckVerde() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1f7a35" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconoMas() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconoColor() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

// Achica la foto y la convierte a texto para poder guardarla en el navegador
function comprimirImagen(archivo, maxLado = 900, calidad = 0.8) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = reject;
    lector.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", calidad));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

function MiMascota() {
  const [mascota, setMascota] = useMiMascota();
  const [modo, setModo] = useState(mascota.publicada ? "vista" : "edicion");
  const [fotoActual, setFotoActual] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const inputFotoRef = useRef(null);

  const handleChange = (campo) => (e) => {
    const valor = e.target.value;
    setMascota((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleFotosSeleccionadas = async (e) => {
    const archivos = Array.from(e.target.files);
    e.target.value = "";

    const espacio = Math.max(MAX_FOTOS - mascota.fotos.length, 0);
    const aSubir = archivos.slice(0, espacio);

    try {
      const nuevas = await Promise.all(aSubir.map((a) => comprimirImagen(a)));
      setMascota((prev) => ({ ...prev, fotos: [...prev.fotos, ...nuevas] }));
    } catch {
      // Si alguna foto no se puede leer, la salteamos
    }
  };

  const handleEliminarFoto = (index) => {
    setMascota((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setFotoActual(0);
  };

  // Lo mínimo que tiene que tener una mascota para publicarse
  const faltantes = [];
  if (!(mascota.nombre || "").trim()) faltantes.push("el nombre");
  if (!(mascota.raza || "").trim()) faltantes.push("la raza");
  if (mascota.fotos.length === 0) faltantes.push("al menos una foto");

  const puedeContinuar = confirmado && faltantes.length === 0;

  const handleContinuar = () => {
    if (!puedeContinuar) return;

    const yaEstabaPublicada = mascota.publicada;
    setMascota((prev) => ({ ...prev, publicada: true }));

    if (!yaEstabaPublicada) {
      agregarNotificacion({
        tipo: "publicada",
        titulo: "¡Tu mascota ya está publicada!",
        descripcion: `${mascota.nombre} ya aparece en Inicio y Buscar para que otros usuarios la vean.`,
        link: `/mascota/${ID_MI_MASCOTA}`,
      });
    }

    setFotoActual(0);
    setModo("vista");
  };

  const abrirEdicion = () => {
    setConfirmado(false);
    setModo("edicion");
  };

  if (modo === "edicion") {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar sinBuscador />

          <div className="mimascota-content">
            <div className="mm-form">
              <h1 className="mm-titulo">Confirmá los datos de tu mascota</h1>
              <p className="mm-subtitulo">
                Revisá que la información de {mascota.nombre || "tu mascota"} sea correcta antes de continuar.
              </p>

              <h3 className="mm-seccion">Datos de la mascota</h3>

              <div className="mm-grid">
                {campos.map((c) => (
                  <div key={c.clave} className="mm-campo">
                    <label htmlFor={`mm-${c.clave}`}>{c.label}</label>
                    <div className="mm-input">
                      <input
                        id={`mm-${c.clave}`}
                        value={mascota[c.clave] || ""}
                        onChange={handleChange(c.clave)}
                        placeholder={c.placeholder}
                      />
                      <button
                        type="button"
                        className="mm-editar"
                        onClick={() => document.getElementById(`mm-${c.clave}`)?.focus()}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mm-campo mm-campo-ancho">
                  <label htmlFor="mm-descripcion">Descripción</label>
                  <div className="mm-input mm-input-area">
                    <textarea
                      id="mm-descripcion"
                      rows={3}
                      maxLength={300}
                      value={mascota.descripcion || ""}
                      onChange={handleChange("descripcion")}
                      placeholder="Contá cómo es tu mascota: su carácter, si es juguetón, con quién se lleva bien..."
                    />
                  </div>
                  <span className="mm-contador">{(mascota.descripcion || "").length}/300</span>
                </div>
              </div>

              <h3 className="mm-seccion">Estado de salud</h3>
              <div className="mm-salud">
                <IconoCheckVerde />
                <div>
                  <strong>Salud verificada</strong>
                  <p>Vacunas y controles al día</p>
                </div>
              </div>

              <label className="mm-confirmar">
                <input
                  type="checkbox"
                  checked={confirmado}
                  onChange={(e) => setConfirmado(e.target.checked)}
                />
                Confirmo que los datos de mi mascota son correctos
              </label>

              {mascota.fotos.length > 0 && (
                <>
                  <p className="mm-fotos-titulo">
                    Fotos de tu mascota ({mascota.fotos.length}/{MAX_FOTOS})
                  </p>
                  <div className="mm-fotos">
                    {mascota.fotos.map((foto, index) => (
                      <div key={index} className="mm-foto">
                        <img src={foto} alt="" />
                        <button
                          type="button"
                          className="mm-foto-x"
                          aria-label="Eliminar foto"
                          onClick={() => handleEliminarFoto(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mm-botones">
                <button
                  type="button"
                  className="mm-subir"
                  disabled={mascota.fotos.length >= MAX_FOTOS}
                  onClick={() => inputFotoRef.current.click()}
                >
                  <IconoMas /> Subir fotos de tu mascota
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={inputFotoRef}
                  onChange={handleFotosSeleccionadas}
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  className="mm-continuar"
                  disabled={!puedeContinuar}
                  onClick={handleContinuar}
                >
                  Continuar
                </button>
              </div>

              {faltantes.length > 0 && (
                <p className="mm-aviso">Para continuar falta: {faltantes.join(", ")}.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const esHembra = (mascota.sexo || "").toLowerCase().includes("hembra");

  const filasVista = [
    { icono: <IconoPata />, label: "Raza", valor: mascota.raza },
    { icono: <IconoCalendario />, label: "Edad", valor: calcularEdad(mascota.fechaNacimiento) },
    { icono: <span className="mimascota-simbolo">{esHembra ? "♀" : "♂"}</span>, label: "Sexo", valor: mascota.sexo },
    { icono: <IconoPeso />, label: "Peso", valor: mascota.peso },
    { icono: <IconoTamano />, label: "Tamaño", valor: mascota.tamano },
    { icono: <IconoColor />, label: "Color", valor: mascota.color },
    { icono: <IconoUbicacion />, label: "Ubicación", valor: mascota.ubicacion },
    { icono: <IconoCorazon activo={true} />, label: "Salud", valor: mascota.salud },
  ].filter((fila) => fila.valor);

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar sinBuscador />

        <div className="mimascota-content">
          <h1 className="mimascota-titulo">Mi mascota</h1>

          {mascota.publicada && (
            <div className="mimascota-publicada">
              <span>
                <IconoCheckVerde /> Tu mascota está publicada y se muestra en Inicio y Buscar.
              </span>
              <Link to={`/mascota/${ID_MI_MASCOTA}`}>Ver cómo la ven los demás</Link>
            </div>
          )}

          <div className="mimascota-card">
            <div className="mimascota-card-foto">
              {mascota.fotos.length > 0 ? (
                <>
                  <img
                    src={mascota.fotos[fotoActual]}
                    alt={mascota.nombre}
                    className="mimascota-foto-principal"
                  />
                  <div className="mimascota-miniaturas">
                    {mascota.fotos.map((foto, index) => (
                      <img
                        key={index}
                        src={foto}
                        alt=""
                        className={index === fotoActual ? "activa" : ""}
                        onClick={() => setFotoActual(index)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="mimascota-sin-foto">Sin fotos todavía</div>
              )}
            </div>

            <div className="mimascota-card-info">
              <h2>{mascota.nombre}</h2>
              <p className="mimascota-card-raza">{mascota.raza}</p>

              <ul>
                {filasVista.map((fila) => (
                  <li key={fila.label}>
                    {fila.icono} <strong>{fila.label}:</strong> {fila.valor}
                  </li>
                ))}
              </ul>

              {mascota.descripcion && (
                <div className="mimascota-descripcion">
                  <strong>Descripción</strong>
                  <p>{mascota.descripcion}</p>
                </div>
              )}

              <button type="button" className="mimascota-editar-btn" onClick={abrirEdicion}>
                Editar perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiMascota;