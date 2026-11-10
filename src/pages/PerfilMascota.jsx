import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "./PerfilMascota.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import { IconoTelefono, IconoEmail, IconoMensaje } from "../components/Iconos";
import { useMascotas } from "../hooks/useMascotas";
import { useLike } from "../hooks/useLike";
import { useUsuario } from "../hooks/useUsuario";

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
  const location = useLocation();
  const mascotas = useMascotas();
  const mascota = mascotas.find((m) => m.id === Number(id));
  const [fotoActual, setFotoActual] = useState(0);
  const { favorito, alternarLike } = useLike(Number(id), mascota?.nombre);
  const { usuario: dueno, cargado: duenoCargado } = useUsuario(mascota?.idDueno ?? null);

  // Determinar la ruta de retorno
  const esVistaPrevia = location.state?.desdeMiMascota;
  const vieneDeMisMascotas = esVistaPrevia || mascota?.esMia;
  const volverRuta = vieneDeMisMascotas ? "/mi-mascota" : "/buscar";

  if (!mascota) {
    return (
      <div className="app-layout">
        <AppSidebar />
        <div className="app-main">
          <TopBar volverA={volverRuta} />
          <div className="pf-contenido">
            <p>No encontramos esta mascota.</p>
            <Link to={volverRuta} className="pf-volver">‹ Volver</Link>
          </div>
        </div>
      </div>
    );
  }

  const total = mascota.fotos.length;

  const anterior = () => setFotoActual((a) => (a === 0 ? total - 1 : a - 1));
  const siguiente = () => setFotoActual((a) => (a === total - 1 ? 0 : a + 1));

  const miniaturas = mascota.fotos.slice(0, 6);
  const restantes = total - miniaturas.length;

  const filas = [
    ["Especie", mascota.especie || "Perro"],
    ["Edad", mascota.edad],
    ["Sexo", mascota.sexo],
    ["Tamaño", mascota.tamano],
    ["Color", mascota.color],
    ["Ubicación", mascota.ubicacion],
  ].filter(([, valor]) => valor);

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar volverA={volverRuta} />

        <div className="pf-contenido">
          {esVistaPrevia && (
            <div className="pf-vista-previa">
              <span>Estás viendo el perfil de {mascota.nombre} como lo ven los demás.</span>
              <Link to="/mi-mascota">Salir de esta vista</Link>
            </div>
          )}

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
                {!mascota.esMia && (
                  <button type="button" className="pf-accion" onClick={alternarLike}>
                    <CorazonGuardar activo={favorito} /> Guardar
                  </button>
                )}
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

              <div className="pf-contacto">
                <p className="pf-contacto-titulo">Datos del dueño</p>
                {dueno ? (
                  <>
                    <p className="pf-contacto-item">
                      <strong>Nombre:</strong> {dueno.nombre} {dueno.apellido}
                    </p>
                    <div className="pf-contacto-item">
                      <strong>Contacto:</strong>
                      <div className="pf-contacto-detalles">
                        <p><IconoEmail /> {dueno.mail}</p>
                        <p><IconoTelefono /> {dueno.telefono}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="pf-contacto-item">
                    {duenoCargado ? "Los datos del dueño no están disponibles." : "Cargando..."}
                  </p>
                )}
              </div>

              {mascota.descripcion && (
                <div className="pf-descripcion">
                  <p className="pf-descripcion-titulo">Sobre {mascota.nombre}</p>
                  <p>{mascota.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilMascota;