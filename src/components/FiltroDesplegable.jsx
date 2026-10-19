import { useState, useRef, useEffect } from "react";
import "./FiltroDesplegable.css";
import { IconoChevron } from "./Iconos";

function FiltroDesplegable({ label, icono, opciones, valor, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const cerrarSiClickAfuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", cerrarSiClickAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiClickAfuera);
  }, []);

  const elegir = (opcion) => {
    onChange(opcion);
    setAbierto(false);
  };

  return (
    <div className="filtro-desplegable" ref={ref}>
      <span className="filtro-desplegable-label">{label}</span>

      <button
        type="button"
        className="filtro-desplegable-boton"
        onClick={() => setAbierto(!abierto)}
      >
        {icono && <span className="filtro-desplegable-icono">{icono}</span>}
        <span className="filtro-desplegable-valor">{valor}</span>
        <IconoChevron />
      </button>

      {abierto && (
        <ul className="filtro-desplegable-lista">
          {opciones.map((opcion) => (
            <li key={opcion}>
              <button
                type="button"
                className={opcion === valor ? "activa" : ""}
                onClick={() => elegir(opcion)}
              >
                {opcion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FiltroDesplegable;