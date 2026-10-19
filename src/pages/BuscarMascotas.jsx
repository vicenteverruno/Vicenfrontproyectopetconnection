import { useState } from "react";
import "./BuscarMascotas.css";
import "./BuscarFiltros.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import FiltroDesplegable from "../components/FiltroDesplegable";
import { IconoPata, IconoRaza, IconoCalendario, IconoUbicacion } from "../components/Iconos";
import { mascotasEjemplo } from "../data/mascotas";
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

function BuscarMascotas() {
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");
  const [edad, setEdad] = useState("Todas");
  const [tamano, setTamano] = useState("Todos");
  const [ubicacion, setUbicacion] = useState("Todas");

  const cambiarEspecie = (nueva) => {
    setEspecie(nueva);
    setRaza("Todas");
  };

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

          <p className="buscar-resultados">{mascotasEjemplo.length} resultados encontrados</p>

          <div className="tarjetas-grid">
            {mascotasEjemplo.map((mascota) => (
              <TarjetaMascotaInicio key={mascota.id} {...mascota} imagen={mascota.fotos[0]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscarMascotas;