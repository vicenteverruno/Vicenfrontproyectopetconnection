import { useState } from "react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const ANIOS_HACIA_ATRAS = 30;

const dosDigitos = (numero) => String(numero).padStart(2, "0");

// Hasta qué mes se puede elegir: no se permiten fechas futuras
function ultimoMes(anio, hoy) {
  return anio === hoy.getFullYear() ? hoy.getMonth() + 1 : 12;
}

function ultimoDia(anio, mes, hoy) {
  if (!mes) return 31;
  if (anio === hoy.getFullYear() && mes === hoy.getMonth() + 1) return hoy.getDate();
  return new Date(anio || 2024, mes, 0).getDate(); // 2024 es bisiesto: deja elegir 29/2 antes del año
}

function SelectorFecha({ valor, onChange }) {
  const hoy = new Date();
  const [anioInicial, mesInicial, diaInicial] = valor ? valor.split("-").map(Number) : [];
  const [fecha, setFecha] = useState({
    dia: diaInicial || "",
    mes: mesInicial || "",
    anio: anioInicial || "",
  });

  const cambiar = (campo, texto) => {
    const nueva = { ...fecha, [campo]: texto === "" ? "" : Number(texto) };
    if (nueva.mes > ultimoMes(nueva.anio, hoy)) nueva.mes = "";
    if (nueva.dia > ultimoDia(nueva.anio, nueva.mes, hoy)) nueva.dia = "";

    setFecha(nueva);
    onChange(
      nueva.dia && nueva.mes && nueva.anio
        ? `${nueva.anio}-${dosDigitos(nueva.mes)}-${dosDigitos(nueva.dia)}`
        : ""
    );
  };

  const cantidadDias = ultimoDia(fecha.anio, fecha.mes, hoy);
  const cantidadMeses = ultimoMes(fecha.anio, hoy);

  return (
    <div className="mm-fecha">
      <div className="mm-input">
        <select aria-label="Día" value={fecha.dia} onChange={(e) => cambiar("dia", e.target.value)}>
          <option value="">Día</option>
          {Array.from({ length: cantidadDias }, (_, i) => i + 1).map((dia) => (
            <option key={dia} value={dia}>{dia}</option>
          ))}
        </select>
      </div>

      <div className="mm-input">
        <select aria-label="Mes" value={fecha.mes} onChange={(e) => cambiar("mes", e.target.value)}>
          <option value="">Mes</option>
          {MESES.slice(0, cantidadMeses).map((nombre, i) => (
            <option key={nombre} value={i + 1}>{nombre}</option>
          ))}
        </select>
      </div>

      <div className="mm-input">
        <select aria-label="Año" value={fecha.anio} onChange={(e) => cambiar("anio", e.target.value)}>
          <option value="">Año</option>
          {Array.from({ length: ANIOS_HACIA_ATRAS + 1 }, (_, i) => hoy.getFullYear() - i).map((anio) => (
            <option key={anio} value={anio}>{anio}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectorFecha;
