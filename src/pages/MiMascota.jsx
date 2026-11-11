import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MiMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import SelectorFecha from "../components/SelectorFecha";
import { useMisMascotas, guardarMascota, elegirActiva, esFotoSinSubir, MAX_FOTOS } from "../hooks/useMiMascota";
import { calcularEdad } from "../hooks/useMascotas";
import { avisar } from "../avisos";
import { miMascotaInicial } from "../data/miMascota";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoTamano } from "../components/Iconos";

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
  const { mascotas, activa, cargado } = useMisMascotas();
  const location = useLocation();
  // Copia que se edita en el formulario. Si es null, se está viendo la mascota.
  const [borrador, setMascota] = useState(() =>
    location.state?.editar && activa ? { ...activa } : null
  );
  const mascota = borrador ?? activa ?? miMascotaInicial;
  const [fotoActual, setFotoActual] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const inputFotoRef = useRef(null);
  const creando = !mascota.idMascota;

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
if (!(mascota.raza || "").trim()) faltantes.push("la raza");
if (!(mascota.color || "").trim()) faltantes.push("el color");
if (!(mascota.ubicacion || "").trim()) faltantes.push("la ubicación");
// Las mascotas creadas antes de subir fotos al back pueden no tener ninguna: al editar no son obligatorias
if (creando && mascota.fotos.length === 0) faltantes.push("al menos una foto");

  const puedeContinuar = faltantes.length === 0 && !guardando;

  const handleContinuar = async () => {
    if (!puedeContinuar) return;

    setGuardando(true);

    try {
      await guardarMascota(mascota);
      setMascota(null);
      setFotoActual(0);
      avisar(creando ? "¡Mascota publicada correctamente!" : "¡Cambios guardados!", "exito");
    } catch (error) {
      console.error("Error al guardar mascota:", error);
      avisar(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const abrirEdicion = () => {
    setMascota({ ...activa });
  };

  const abrirCreacion = () => {
    setMascota({ ...miMascotaInicial, raza: razasPorEspecie.Perro[0], fotos: [] });
  };

  const cambiarActiva = (idMascota) => {
    elegirActiva(idMascota);
    setFotoActual(0);
  };

  const especieActual = mascota.especie || "Perro";
  const razasDisponibles = razasPorEspecie[especieActual] || razasPorEspecie.Perro;

  if (borrador) {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar />

          <div className="mimascota-content">
            <div className="mm-form">
              <h1 className="mm-titulo">
                {creando ? "Cargá los datos de tu mascota" : `Editá los datos de ${activa?.nombre ?? "tu mascota"}`}
              </h1>
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
                  <span className="mm-etiqueta">Fecha de nacimiento</span>
                  <SelectorFecha
                    key={mascota.idMascota ?? "nueva"}
                    valor={mascota.fechaNacimiento || ""}
                    onChange={(fecha) => handleChange("fechaNacimiento", fecha)}
                  />
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
                        {/* El back todavía no permite borrar las fotos ya subidas */}
                        {esFotoSinSubir(foto) && (
                          <button
                            type="button"
                            className="mm-foto-x"
                            onClick={() => handleEliminarFoto(index)}
                          >
                            ×
                          </button>
                        )}
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

                <div className="mm-botones-derecha">
                  <button type="button" className="mm-cancelar" onClick={() => setMascota(null)}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="mm-continuar"
                    disabled={!puedeContinuar}
                    onClick={handleContinuar}
                  >
                    {creando ? "Guardar y publicar" : "Guardar cambios"}
                  </button>
                </div>
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
        <TopBar />

        <div className="mimascota-content">
          <div className="mimascota-header-acciones">
            <h1 className="mimascota-titulo">Mis mascotas</h1>
            <button type="button" className="mimascota-agregar-btn" onClick={abrirCreacion}>
              + Agregar mascota
            </button>
          </div>

          {!cargado ? (
            <p>Cargando tus mascotas...</p>
          ) : activa ? (
            <>
              {mascotas.length > 1 && (
                <div className="mimascota-selector">
                  <span>Das likes y comentás como:</span>
                  {mascotas.map((m) => (
                    <button
                      key={m.idMascota}
                      type="button"
                      className={m.idMascota === activa.idMascota ? "activa" : ""}
                      onClick={() => cambiarActiva(m.idMascota)}
                    >
                      {m.nombre}
                    </button>
                  ))}
                </div>
              )}

              <div className="mimascota-publicada">
                <span>Tu mascota está publicada y se muestra en la plataforma.</span>
                <Link to={`/mascota/${mascota.idMascota}`} state={{ desdeMiMascota: true }}>
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
              <button type="button" className="mm-continuar" onClick={abrirCreacion}>
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