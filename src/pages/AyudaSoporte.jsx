import { useState } from "react";
import { Link } from "react-router-dom";
import "./AyudaSoporte.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { IconoTelefono, IconoEmail } from "../components/Iconos";

const preguntas = [
  {
    pregunta: "¿Cómo creo el perfil de mi mascota?",
    respuesta: "Andá a \"Mi mascota\" en el menú, tocá \"Agregar mascota\" y completá nombre, raza, edad, sexo, peso y fotos. Podés editarlo cuando quieras.",
  },
  {
    pregunta: "¿Es gratis usar Pet Connection?",
    respuesta: "Sí, crear tu cuenta, publicar el perfil de tu mascota y contactar a otros dueños es completamente gratis.",
  },
  {
    pregunta: "¿Cómo contacto al dueño de otra mascota?",
    respuesta: "Entrá al perfil de la mascota que te interesa y escribe a su número telefonico o comentando sus publicaciones.",
  },
  {
    pregunta: "¿Cómo cambio mi contraseña?",
    respuesta: "Andá a Configuración > Cambiar contraseña.",
  },
];

function AyudaSoporte() {
  const [abierta, setAbierta] = useState(3);

  const toggle = (index) => {
    setAbierta(abierta === index ? null : index);
  };

  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <TopBar />

        <div className="ayuda-content">
          <Link to="/configuracion" className="ayuda-volver">
            ‹ Volver
          </Link>

          <h1>Ayuda y soporte</h1>
          <p className="ayuda-subtitulo">
            Encontrá respuestas rápidas o contactate con nuestro equipo
          </p>

          <div className="ayuda-card">
            <h3>Preguntas frecuentes</h3>

            {preguntas.map((item, index) => (
              <div key={index} className="ayuda-faq">
                <button
                  type="button"
                  className="ayuda-faq-pregunta"
                  onClick={() => toggle(index)}
                >
                  {item.pregunta}
                  <span>{abierta === index ? "⌄" : "›"}</span>
                </button>
                {abierta === index && (
                  <p className="ayuda-faq-respuesta">{item.respuesta}</p>
                )}
              </div>
            ))}
          </div>

          <div className="ayuda-card">
            <h3>Contactanos</h3>

            <div className="ayuda-contacto-fila">
              <span className="ayuda-contacto-icono"><IconoEmail /></span>
              <div>
                <strong>Email</strong>
                <p>soporte@petconnection.com</p>
              </div>
            </div>

            <div className="ayuda-contacto-fila">
              <span className="ayuda-contacto-icono"><IconoTelefono /></span>
              <div>
                <strong>Teléfono</strong>
                <p>+54 11 5555-1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AyudaSoporte;