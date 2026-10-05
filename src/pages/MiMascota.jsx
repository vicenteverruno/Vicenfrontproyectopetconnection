import { useState, useRef } from "react";
import "./MiMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { useMiMascota } from "../hooks/useMiMascota";
import { IconoPata, IconoCalendario, IconoUbicacion, IconoCorazon, IconoPeso, IconoTamano } from "../components/Iconos";

function MiMascota() {
  const [mascota, setMascota] = useMiMascota();
  const [modo, setModo] = useState(mascota.fotos.length > 0 ? "vista" : "edicion");
  const [fotoActual, setFotoActual] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const inputFotoRef = useRef(null);

  const handleChange = (campo) => (e) => {
    setMascota({ ...mascota, [campo]: e.target.value });
  };

  const handleFotosSeleccionadas = (e) => {
    const archivos = Array.from(e.target.files);
    const nuevasFotos = archivos.map((archivo) => URL.createObjectURL(archivo));
    setMascota((prev) => ({ ...prev, fotos: [...prev.fotos, ...nuevasFotos] }));
  };

  const handleEliminarFoto = (index) => {
    setMascota((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
    setFotoActual(0);
  };

  const handleContinuar = () => {
    if (!confirmado || mascota.fotos.length === 0) return;
    setModo("vista");
  };

  if (modo === "edicion") {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar />
          <div className="mimascota-content">
            <h1>Confirmá los datos de tu mascota</h1>
            <p className="mimascota-subtitle">
              Revisá que la información de {mascota.nombre} sea correcta antes de continuar.
            </p>

            <h3 className="mimascota-section-title">Fotos de tu mascota</h3>

            <div className="mimascota-fotos-grid">
              {mascota.fotos.map((foto, index) => (
                <div key={index} className="mimascota-foto-miniatura">
                  <img src={foto} alt="" />
                  <button
                    type="button"
                    className="mimascota-foto-eliminar"
                    onClick={() => handleEliminarFoto(index)}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="mimascota-foto-agregar"
                onClick={() => inputFotoRef.current.click()}
              >
                + Agregar
              </button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={inputFotoRef}
                onChange={handleFotosSeleccionadas}
                style={{ display: "none" }}
              />
            </div>

            <h3 className="mimascota-section-title">Datos de la mascota</h3>

            <div className="mimascota-form-grid">
              <div className="mimascota-field">
                <label>Nombre</label>
                <div className="mimascota-input-row">
                  <input value={mascota.nombre} onChange={handleChange("nombre")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>

              <div className="mimascota-field">
                <label>Raza</label>
                <div className="mimascota-input-row">
                  <input value={mascota.raza} onChange={handleChange("raza")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>

              <div className="mimascota-field">
                <label>Fecha de nacimiento</label>
                <div className="mimascota-input-row">
                  <input value={mascota.fechaNacimiento} onChange={handleChange("fechaNacimiento")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>

              <div className="mimascota-field">
                <label>Sexo</label>
                <div className="mimascota-input-row">
                  <input value={mascota.sexo} onChange={handleChange("sexo")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>

              <div className="mimascota-field">
                <label>Peso</label>
                <div className="mimascota-input-row">
                  <input value={mascota.peso} onChange={handleChange("peso")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>

              <div className="mimascota-field">
                <label>Tamaño</label>
                <div className="mimascota-input-row">
                  <input value={mascota.tamano} onChange={handleChange("tamano")} />
                  <span className="mimascota-editar">Editar</span>
                </div>
              </div>
            </div>

            <h3 className="mimascota-section-title">Estado de salud</h3>
            <div className="mimascota-salud-box">
              ✅ <strong>Salud verificada</strong>
              <br />
              <span>Vacunas y controles al día.</span>
            </div>

            <label className="mimascota-checkbox">
              <input
                type="checkbox"
                checked={confirmado}
                onChange={(e) => setConfirmado(e.target.checked)}
              />
              Confirmo que los datos de mi mascota son correctos
            </label>

            {mascota.fotos.length === 0 && (
              <p className="mimascota-aviso">Subí al menos una foto para continuar.</p>
            )}

            <div className="mimascota-form-buttons">
              <button
                type="button"
                className="mimascota-continuar-btn"
                disabled={!confirmado || mascota.fotos.length === 0}
                onClick={handleContinuar}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />
        <div className="mimascota-content">
          <h1>Mi mascota</h1>

          <div className="mimascota-card">
            <div className="mimascota-card-foto">
              {mascota.fotos.length > 0 ? (
                <>
                  <img src={mascota.fotos[fotoActual]} alt={mascota.nombre} />
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
                <li><IconoPata /> <strong>Raza:</strong> {mascota.raza}</li>
                <li><IconoCalendario /> <strong>Edad:</strong> {mascota.fechaNacimiento}</li>
                <li><span className="mimascota-simbolo">{mascota.sexo === "Macho" ? "♂" : "♀"}</span> <strong>Sexo:</strong> {mascota.sexo}</li>
                <li><IconoPeso /> <strong>Peso:</strong> {mascota.peso}</li>
                <li><IconoTamano /> <strong>Tamaño:</strong> {mascota.tamano}</li>
                <li><IconoUbicacion /> <strong>Ubicación:</strong> {mascota.ubicacion}</li>
                <li><IconoCorazon activo={true} /> <strong>Salud:</strong> {mascota.salud}</li>
              </ul>

              <button type="button" className="mimascota-editar-btn" onClick={() => setModo("edicion")}>
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