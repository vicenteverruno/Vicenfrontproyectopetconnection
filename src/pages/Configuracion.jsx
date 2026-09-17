import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";

function Toggle({ activo, onChange }) {
  return (
    <button
      type="button"
      className={`config-toggle ${activo ? "activo" : ""}`}
      onClick={onChange}
    >
      <span className="config-toggle-bola"></span>
    </button>
  );
}

function Configuracion() {
  const navigate = useNavigate();

  const [notificaciones, setNotificaciones] = useState(true);
  const [mensajesNuevos, setMensajesNuevos] = useState(true);
  const [actualizacionesEmail, setActualizacionesEmail] = useState(false);
  const [mostrarUbicacion, setMostrarUbicacion] = useState(true);
  const [perfilVisible, setPerfilVisible] = useState(true);

  const [modal, setModal] = useState(null); // null | "cerrarSesion" | "eliminar1" | "eliminar2"
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState(["", "", "", "", "", ""]);
  const [codigoError, setCodigoError] = useState(false);
  const inputsRef = useRef([]);

  const abrirEliminarPaso2 = () => {
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setCodigoIngresado(["", "", "", "", "", ""]);
    setCodigoError(false);
    setModal("eliminar2");
  };

  const handleCodigoChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const nuevo = [...codigoIngresado];
    nuevo[index] = value;
    setCodigoIngresado(nuevo);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const confirmarEliminacion = () => {
    if (codigoIngresado.join("") === codigoGenerado) {
      navigate("/registro");
    } else {
      setCodigoError(true);
    }
  };

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />

        <div className="config-content">
          <h1>Configuración</h1>

          <div className="config-card">
            <p className="config-seccion-titulo">Cuenta</p>
            <button type="button" className="config-fila">
              Editar perfil <span>›</span>
            </button>
            <button
              type="button"
              className="config-fila"
              onClick={() => navigate("/cambiar-contrasena")}
            >
              Cambiar contraseña <span>›</span>
            </button>

            <p className="config-seccion-titulo">Notificaciones</p>
            <div className="config-fila">
              Notificaciones
              <Toggle activo={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
            </div>
            <div className="config-fila">
              Mensajes nuevos
              <Toggle activo={mensajesNuevos} onChange={() => setMensajesNuevos(!mensajesNuevos)} />
            </div>
            <div className="config-fila">
              Actualizaciones por email
              <Toggle activo={actualizacionesEmail} onChange={() => setActualizacionesEmail(!actualizacionesEmail)} />
            </div>

            <p className="config-seccion-titulo">Privacidad</p>
            <div className="config-fila">
              Mostrar mi ubicación
              <Toggle activo={mostrarUbicacion} onChange={() => setMostrarUbicacion(!mostrarUbicacion)} />
            </div>
            <div className="config-fila">
              Perfil visible para otros usuarios
              <Toggle activo={perfilVisible} onChange={() => setPerfilVisible(!perfilVisible)} />
            </div>

            <p className="config-seccion-titulo">Otros</p>
            <button
              type="button"
              className="config-fila"
              onClick={() => navigate("/ayuda-soporte")}
            >
              Ayuda y soporte <span>›</span>
            </button>
            <button
              type="button"
              className="config-fila config-fila-peligro"
              onClick={() => setModal("cerrarSesion")}
            >
              Cerrar sesión <span>{modal === "cerrarSesion" ? "⌄" : "›"}</span>
            </button>
            <button
              type="button"
              className="config-fila config-fila-peligro"
              onClick={() => setModal("eliminar1")}
            >
              Eliminar cuenta <span>{modal === "eliminar1" || modal === "eliminar2" ? "⌄" : "›"}</span>
            </button>

            {modal === "cerrarSesion" && (
              <div className="config-modal-overlay">
                <div className="config-modal-box">
                  <p>¿Seguro que deseas cerrar sesión?</p>
                  <div className="config-modal-botones">
                    <button className="config-modal-btn" onClick={() => navigate("/registro")}>
                      Aceptar
                    </button>
                    <button className="config-modal-btn secundario" onClick={() => setModal(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal === "eliminar1" && (
              <div className="config-modal-overlay">
                <div className="config-modal-box">
                  <p>
                    Estás a punto de eliminar tu cuenta. Esta acción borrará permanentemente tu
                    perfil, la información de tus mascotas y tu historial. Si estás seguro,
                    confirmá la eliminación a continuación.
                  </p>
                  <div className="config-modal-botones">
                    <button className="config-modal-btn" onClick={abrirEliminarPaso2}>
                      Confirmar eliminación
                    </button>
                    <button className="config-modal-btn secundario" onClick={() => setModal(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal === "eliminar2" && (
              <div className="config-modal-overlay">
                <div className="config-modal-box">
                  <h3>Eliminar cuenta</h3>
                  <p className="config-modal-codigo">
                    Tu código de verificación: {codigoGenerado}
                  </p>
                  <p className="config-modal-subtitulo">Verificá tu decisión</p>
                  <p>
                    Estás a punto de eliminar tu cuenta permanentemente. Para confirmar,
                    ingresá el código de 6 dígitos que aparece arriba.
                  </p>

                  <div className="config-codigo-inputs">
                    {codigoIngresado.map((digito, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digito}
                        onChange={(e) => handleCodigoChange(index, e.target.value)}
                        className={codigoError ? "campo-error" : ""}
                      />
                    ))}
                  </div>

                  {codigoError && (
                    <p className="config-modal-error">El código no coincide, intentá de nuevo.</p>
                  )}

                  <div className="config-modal-botones">
                    <button className="config-modal-btn" onClick={confirmarEliminacion}>
                      Confirmar eliminación
                    </button>
                    <button className="config-modal-btn secundario" onClick={() => setModal(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;