import { useState } from "react";
import { Link } from "react-router-dom";
import "./CambiarPassword.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";

function CambiarPassword() {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nueva.length < 8 || nueva !== confirmar) {
      setError(true);
      setGuardado(false);
      return;
    }

    setError(false);
    setGuardado(true);
  };

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />

        <div className="cambiar-password-content">
          <Link to="/configuracion" className="cambiar-password-volver">
            ‹ Volver a configuración
          </Link>

          <h1>Cambiar contraseña</h1>
          <p className="cambiar-password-subtitulo">
            Actualizá tu contraseña para mantener tu cuenta segura.
          </p>

          <form className="cambiar-password-card" onSubmit={handleSubmit}>
            <label>Contraseña actual</label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />

            <label>Nueva contraseña</label>
            <input
              type="password"
              className={error ? "campo-error" : ""}
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />

            <label>Confirmar nueva contraseña</label>
            <input
              type="password"
              className={error ? "campo-error" : ""}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />

            <button type="submit" className="cambiar-password-btn">
              Guardar cambios
            </button>

            {error ? (
              <p className="cambiar-password-hint error">
                Usá una contraseña de al menos 8 caracteres.
              </p>
            ) : (
              <p className="cambiar-password-hint">
                Usá una contraseña de al menos 8 caracteres.
              </p>
            )}

            {guardado && (
              <p className="cambiar-password-exito">
                ✅ Contraseña actualizada correctamente.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CambiarPassword;