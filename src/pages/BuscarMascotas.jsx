import { useState } from "react";
import "./BuscarMascotas.css";
import "./BuscarFiltros.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import FiltroDesplegable from "../components/FiltroDesplegable";
import { IconoPata, IconoRaza, IconoCalendario, IconoUbicacion } from "../components/Iconos";
import { useMascotas } from "../hooks/useMascotas";
import iconoCorazon from "../assets/icono-corazon.png";

const especies = ["Perro", "Gato"];

const razasPorEspecie = {
  Perro: ["Todas", "Labrador", "Golden", "Pastor alemán", "Border collie", "Bulldog francés", "Caniche", "Beagle", "Husky siberiano", "Otro"],
  Gato: ["Todas", "Siamés", "Persa", "Maine coon", "Ragdoll", "Bengalí", "British shorthair", "Sphynx"],
};

const sexos = ["Todos", "Macho", "Hembra"];
const edades = ["Todas", "0-1", "1-2", "2-4", "4-6", "6-8", "8-10", "10-12", "12-14", "+14"];
const tamanos = ["Todos", "Pequeño", "Mediano", "Grande"];
const ubicaciones = ["Todas", "CABA", "Zona sur", "Zona norte", "Zona oeste", "La Plata", "Provincia de Buenos Aires", "Otra"];

// AGREGADO: rangos de edad en años: [desde, hasta)
const rangosEdad = {
  "0-1": [0, 1],
  "1-2": [1, 2],
  "2-4": [2, 4],
  "4-6": [4, 6],
  "6-8": [6, 8],
  "8-10": [8, 10],
  "10-12": [10, 12],
  "12-14": [12, 14],
  "+14": [14, Infinity],
};

// AGREGADO: calcula la edad en años a partir de la fecha de nacimiento ("2022-05-10")
function edadEnAnios(nacimiento) {
  const partes = String(nacimiento || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!partes) return null;

  const nac = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (hoy.getDate() < nac.getDate()) meses -= 1;

  return meses / 12;
}

function BuscarMascotas() {
  // SACADO: const mascotas = useMascotas();
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");
  const [edad, setEdad] = useState("Todas");
  const [tamano, setTamano] = useState("Todos");
  const [ubicacion, setUbicacion] = useState("Todas");

  // AGREGADO: especie, sexo y tamaño los filtra el back (se mandan como filtros).
  // Se movió DEBAJO de los useState porque necesita sus valores.
  const todas = useMascotas({
    especie,
    sexo: sexo === "Todos" ? "" : sexo,
    tamano: tamano === "Todos" ? "" : tamano,
  });

  // AGREGADO: raza, edad y ubicación se filtran acá sobre lo que mandó el back
  const zonasConocidas = ubicaciones.filter((u) => u !== "Todas" && u !== "Otra");

  const mascotas = todas.filter((m) => {
    if (raza !== "Todas" && !(m.raza || "").toLowerCase().includes(raza.toLowerCase())) {
      return false;
    }

    if (edad !== "Todas") {
      const anios = edadEnAnios(m.nacimiento);
      const [desde, hasta] = rangosEdad[edad];
      if (anios === null || anios < desde || anios >= hasta) return false;
    }

    if (ubicacion !== "Todas") {
      const lugar = (m.ubicacion || "").toLowerCase();
      if (ubicacion === "Otra") {
        if (zonasConocidas.some((z) => lugar.includes(z.toLowerCase()))) return false;
      } else if (!lugar.includes(ubicacion.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const cambiarEspecie = (nueva) => {
    setEspecie(nueva);
    setRaza("Todas");
  };

  // ---------- TODO LO DE ABAJO ES IGUAL A TU ARCHIVO ----------
  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar />

        <div className="buscar-pagina">
          <h1 className="buscar-titulo">Buscar mascotas</h1>
          <p className="buscar-subtitulo">
            Encontrá la pareja ideal para tu mascota
            <img src={iconoCorazon} alt="" />
          </p>

          <div className="buscar-filtros">
            <FiltroDesplegable
              label="Especie"
              icono={<IconoPata size={16} />}
              opciones={especies}
              valor={especie}
              onChange={cambiarEspecie}
            />
            <FiltroDesplegable
              label="Raza"
              icono={<IconoRaza size={16} />}
              opciones={razasPorEspecie[especie]}
              valor={raza}
              onChange={setRaza}
            />
            <FiltroDesplegable
              label="Sexo"
              icono={<span className="filtro-simbolo">{sexo === "Hembra" ? "♀" : "♂"}</span>}
              opciones={sexos}
              valor={sexo}
              onChange={setSexo}
            />
            <FiltroDesplegable
              label="Edad"
              icono={<IconoCalendario size={16} />}
              opciones={edades}
              valor={edad}
              onChange={setEdad}
            />
            <FiltroDesplegable
              label="Tamaño"
              opciones={tamanos}
              valor={tamano}
              onChange={setTamano}
            />
            <FiltroDesplegable
              label="Ubicación"
              icono={<IconoUbicacion size={16} />}
              opciones={ubicaciones}
              valor={ubicacion}
              onChange={setUbicacion}
            />
          </div>

          <p className="buscar-resultados">{mascotas.length} resultados encontrados</p>

          <div className="tarjetas-grid">
            {mascotas.map((mascota) => (
              <TarjetaMascotaInicio key={mascota.id} {...mascota} imagen={mascota.fotos[0]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscarMascotas;