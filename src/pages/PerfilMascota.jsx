import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PerfilMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { mascotasEjemplo } from "../data/mascotas";

function PerfilMascota() {
  const { id } = useParams();
  const mascota = mascotasEjemplo.find((m) => m.id === Number(id));
  const [fotoActual, setFotoActual] = useState(0);

  if (!mascota) {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar />
          <div className="perfil-content">
            <p>No encontramos esta mascota.</p>
            <Link to="/buscar">‹ Volver a buscar</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalFotos = mascota.fotos.length;

  const fotoAnterior = () => {
    setFotoActual((actual) => (actual === 0 ? totalFotos - 1 : actual - 1));
  };

  const fotoSiguiente = () => {
    setFotoActual((actual) => (actual === totalFotos - 1 ? 0 : actual + 1));
  };

  const miniaturasVisibles = mascota.fotos.slice(0, 5);
  const fotosRestantes = totalFotos - miniaturasVisibles.length;

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar />

        <div className="perfil-content">
          <Link to="/buscar" className="perfil-volver">‹ Volver</Link>

          <div className="perfil-grid">
            <div className="perfil-galeria">
              <div className="perfil-foto-principal">
                <button className="perfil-foto-flecha izquierda" onClick={fotoAnterior}>‹</button>
                <img src={mascota.fotos[fotoActual]} alt={mascota.nombre} />
                <button className="perfil-foto-flecha derecha" onClick={fotoSiguiente}>›</button>
              </div>

              <div className="perfil-miniaturas">
                {miniaturasVisibles.map((foto, index) => (
                  <div
                    key={index}
                    className={`perfil-miniatura ${index === fotoActual ? "activa" : ""}`}
                    onClick={() => setFotoActual(index)}
                  >
                    <img src={foto} alt="" />
                    {index === miniaturasVisibles.length - 1 && fotosRestantes > 0 && (
                      <span className="perfil-miniatura-mas">+{fotosRestantes}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="perfil-acciones">
                <span>🤍 Guardar</span>
                <span>💬 Comentar</span>
              </div>

              <div className="perfil-salud">
                <h3>Salud</h3>
                <div className="perfil-salud-verificada">
                  ✅ Salud verificada — Controles y documentación al día.
                </div>
                <div className="perfil-salud-grid">
                  <p>{mascota.salud.vacunas ? "✅" : "❌"} Vacunas<br /><span>Al día</span></p>
                  <p>{mascota.salud.desparasitacion ? "✅" : "❌"} Desparasitación<br /><span>Al día</span></p>
                  <p>{mascota.salud.enfermedadesGeneticas ? "✅" : "❌"} Enfermedades genéticas<br /><span>Sin antecedentes</span></p>
                  <p>{mascota.salud.certificadoSalud ? "✅" : "❌"} Certificado de salud<br /><span>Vigente</span></p>
                </div>
              </div>
            </div>

            <div className="perfil-datos">
              <h1>{mascota.nombre}</h1>
              <p className="perfil-raza">{mascota.raza}</p>

              <dl>
                <dt>Edad</dt><dd>{mascota.edad}</dd>
                <dt>Sexo</dt><dd>{mascota.sexo}</dd>
                <dt>Peso</dt><dd>{mascota.peso}</dd>
                <dt>Tamaño</dt><dd>{mascota.tamano}</dd>
                <dt>Ubicación</dt><dd>{mascota.ubicacion}</dd>
              </dl>

              <div className="perfil-contacto">
                <strong>Contacto del dueño</strong>
                <div className="perfil-contacto-row">
                  <span>📞 {mascota.telefono}</span>
                  <a href={`tel:${mascota.telefono}`}>Llamar</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilMascota;