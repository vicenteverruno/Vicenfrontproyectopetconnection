import { useState } from "react";
import "./BuscarMascotas.css";
import "./BuscarFiltros.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import FiltroDesplegable from "../components/FiltroDesplegable";
import { IconoPata, IconoRaza, IconoUbicacion } from "../components/Iconos";
import { useMascotas } from "../hooks/useMascotas";
import iconoCorazon from "../assets/icono-corazon.png";

const especies = ["Perro", "Gato"];

const razasPorEspecie = {
  Perro: ["Todas", "Labrador", "Golden", "Pastor alemán", "Border collie", "Bulldog francés", "Caniche", "Beagle", "Husky siberiano", "Otro"],
  Gato: ["Todas", "Siamés", "Persa", "Maine coon", "Ragdoll", "Bengalí", "British shorthair", "Sphynx"],
};

const sexos = ["Todos", "Macho", "Hembra"];
const tamanos = ["Todos", "Pequeño", "Mediano", "Grande"];
const ubicaciones = ["Todas", "CABA", "Zona sur", "Zona norte", "Zona oeste", "La Plata", "Provincia de Buenos Aires", "Otra"];

function BuscarMascotas() {
  // SACADO: const mascotas = useMascotas();
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");
  const [tamano, setTamano] = useState("Todos");
  const [ubicacion, setUbicacion] = useState("Todas");

  // AGREGADO: especie, sexo y tamaño los filtra el back (se mandan como filtros).
  // Se movió DEBAJO de los useState porque necesita sus valores.
  const todas = useMascotas({
    especie,
    sexo: sexo === "Todos" ? "" : sexo,
    tamano: tamano === "Todos" ? "" : tamano,
  });

  // AGREGADO: raza y ubicación se filtran acá sobre lo que mandó el back
  const zonasConocidas = ubicaciones.filter((u) => u !== "Todas" && u !== "Otra");

  const mascotas = todas.filter((m) => {
    if (raza !== "Todas" && !(m.raza || "").toLowerCase().includes(raza.toLowerCase())) {
      return false;
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