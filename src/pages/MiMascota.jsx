import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./MiMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { useMiMascota } from "../hooks/useMiMascota";
import { ID_MI_MASCOTA, calcularEdad } from "../hooks/useMascotas";
import { agregarNotificacion } from "../hooks/useNotificaciones";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoTamano } from "../components/Iconos";

const MAX_FOTOS = 8;

const especiesDisponibles = ["Perro", "Gato"];

const razasPorEspecie = {
  Perro: ["Labrador", "Golden Retriever", "Pastor alemán", "Border collie", "Bulldog francés", "Caniche", "Beagle", "Husky siberiano", "Mestizo / Otro"],
  Gato: ["Siamés", "Persa", "Maine coon", "Ragdoll", "Bengalí", "British shorthair", "Sphynx", "Mestizo / Otro"],
};

const sexosDisponibles = ["Macho", "Hembra"];
const tamanosDisponibles = ["Pequeño", "Mediano", "Grande"];

function IconoMas() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

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
  const inputFotoRef = useRef(null);

  const handleChange = (campo, valor) => {
    setMascota((prev) => {
      const nuevo = { ...prev, [campo]: valor };
      if (campo === "especie") {
        nuevo.raza = razasPorEspecie[valor][0];
      }
      return nuevo;
    });
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
      // Ignorar fotos fallidas
    }
  };

  const handleEliminarFoto = (index) => {
    setMascota((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setFotoActual(0);
  };

  const faltantes = [];
  if (!(mascota.nombre || "").trim()) faltantes.push("el nombre");
  if (!mascota.fechaNacimiento) faltantes.push("la fecha de nacimiento");
  if (mascota.fotos.length === 0) faltantes.push("al menos una foto");

  const puedeContinuar = faltantes.length === 0;

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
    setModo("edicion");
  };

  const especieActual = mascota.especie || "Perro";
  const razasDisponibles = razasPorEspecie[especieActual] || razasPorEspecie.Perro;

  if (modo === "edicion") {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar sinBuscador />

          <div className="mimascota-content">
            <div className="mm-form">
              <h1 className="mm-titulo">Carga los datos de tu mascota</h1>
              <p className="mm-subtitulo">
                Completá la información requerida para dar a conocer a tu mascota.
              </p>

              <h3 className="mm-seccion">Datos principales</h3>

              <div className="mm-grid">
                {/* Especie */}
                <div className="mm-campo">
                  <label htmlFor="mm-especie">Especie</label>
                  <div className="mm-input">
                    <select
                      id="mm-especie"
                      value={especieActual}
                      onChange={(e) => handleChange("especie", e.target.value)}
                    >
                      {especiesDisponibles.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nombre */}
                <div className="mm-campo">
                  <label htmlFor="mm-nombre">Nombre</label>
                  <div className="mm-input">
                    <input
                      id="mm-nombre"
                      type="text"
                      placeholder="Ej: Rocky"
                      value={mascota.nombre || ""}
                      onChange={(e) => handleChange("nombre", e.target.value)}
                    />
                  </div>
                </div>

                {/* Raza */}
                <div className="mm-campo">
                  <label htmlFor="mm-raza">Raza</label>
                  <div className="mm-input">
                    <select
                      id="mm-raza"
                      value={mascota.raza || razasDisponibles[0]}
                      onChange={(e) => handleChange("raza", e.target.value)}
                    >
                      {razasDisponibles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div className="mm-campo">
                  <label htmlFor="mm-fechaNacimiento">Fecha de nacimiento</label>
                  <div className="mm-input">
                    <input
                      id="mm-fechaNacimiento"
                      type="date"
                      value={mascota.fechaNacimiento || ""}
                      onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                    />
                  </div>
                </div>

                {/* Sexo */}
                <div className="mm-campo">
                  <label htmlFor="mm-sexo">Sexo</label>
                  <div className="mm-input">
                    <select
                      id="mm-sexo"
                      value={mascota.sexo || "Macho"}
                      onChange={(e) => handleChange("sexo", e.target.value)}
                    >
                      {sexosDisponibles.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tamaño */}
                <div className="mm-campo">
                  <label htmlFor="mm-tamano">Tamaño</label>
                  <div className="mm-input">
                    <select
                      id="mm-tamano"
                      value={mascota.tamano || "Mediano"}
                      onChange={(e) => handleChange("tamano", e.target.value)}
                    >
                      {tamanosDisponibles.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color */}
                <div className="mm-campo">
                  <label htmlFor="mm-color">Color</label>
                  <div className="mm-input">
                    <input
                      id="mm-color"
                      type="text"
                      placeholder="Ej: Dorado"
                      value={mascota.color || ""}
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                </div>

                {/* Ubicación */}
                <div className="mm-campo">
                  <label htmlFor="mm-ubicacion">Ubicación</label>
                  <div className="mm-input">
                    <input
                      id="mm-ubicacion"
                      type="text"
                      placeholder="Ej: Palermo, CABA"
                      value={mascota.ubicacion || ""}
                      onChange={(e) => handleChange("ubicacion", e.target.value)}
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="mm-campo mm-campo-ancho">
                  <label htmlFor="mm-descripcion">Descripción</label>
                  <div className="mm-input mm-input-area">
                    <textarea
                      id="mm-descripcion"
                      rows={3}
                      maxLength={300}
                      value={mascota.descripcion || ""}
                      onChange={(e) => handleChange("descripcion", e.target.value)}
                      placeholder="Contá cómo es tu mascota..."
                    />
                  </div>
                  <span className="mm-contador">{(mascota.descripcion || "").length}/300</span>
                </div>
              </div>

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
                  <IconoMas /> Subir fotos
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
                  Guardar y publicar
                </button>
              </div>

              {faltantes.length > 0 && (
                <p className="mm-aviso">Falta completar: {faltantes.join(", ")}.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const esHembra = (mascota.sexo || "").toLowerCase().includes("hembra");

  const filasVista = [
    { icono: <IconoPata />, label: "Especie", valor: mascota.especie },
    { icono: <IconoPata />, label: "Raza", valor: mascota.raza },
    { icono: <IconoCalendario />, label: "Edad", valor: calcularEdad(mascota.fechaNacimiento) },
    { icono: <span className="mimascota-simbolo">{esHembra ? "♀" : "♂"}</span>, label: "Sexo", valor: mascota.sexo },
    { icono: <IconoTamano />, label: "Tamaño", valor: mascota.tamano },
    { icono: <IconoUbicacion />, label: "Ubicación", valor: mascota.ubicacion },
  ].filter((fila) => fila.valor);

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar sinBuscador />

        <div className="mimascota-content">
          <div className="mimascota-header-acciones">
            <h1 className="mimascota-titulo">Mis mascotas</h1>
            <button
              type="button"
              className="mimascota-agregar-btn"
              disabled={mascota.publicada}
              onClick={abrirEdicion}
              title={mascota.publicada ? "Solo podés tener una mascota registrada a la vez" : ""}
            >
              + Agregar mascota
            </button>
          </div>

          {mascota.publicada ? (
            <>
              <div className="mimascota-publicada">
                <span>Tu mascota está publicada y se muestra en la plataforma.</span>
                <Link to={`/mascota/${ID_MI_MASCOTA}`} state={{ desdeMiMascota: true }}>
                  Ver cómo la ven los demás
                </Link>
              </div>

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
            </>
          ) : (
            <div className="mimascota-vacio-box">
              <p>No tenés ninguna mascota registrada todavía.</p>
              <button type="button" className="mm-continuar" onClick={abrirEdicion}>
                Crear perfil de mi mascota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiMascota;