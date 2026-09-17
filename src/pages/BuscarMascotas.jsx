import { useState } from "react";
import "./BuscarMascotas.css";
import AppSidebar from "../components/AppSidebar";
import TopBar from "../components/TopBar";
import TarjetaMascotaInicio from "../components/TarjetaMascotaInicio";
import { mascotasEjemplo } from "../data/mascotas";

const razasPorEspecie = {
  Perro: ["Todas", "Labrador", "Golden", "Pastor alemán", "Border collie", "Bulldog francés", "Caniche", "Beagle", "Husky siberiano", "Otro"],
  Gato: ["Todas", "Siamés", "Persa", "Maine coon", "Ragdoll", "Bengalí", "British shorthair", "Sphynx"],
};

const edades = ["Todas", "0-1", "1-2", "2-4", "4-6", "6-8", "8-10", "10-12", "12-14", "+14"];
const tamanos = ["Todos", "Pequeño", "Mediano", "Grande"];
const ubicaciones = ["Todas", "CABA", "Zona sur", "Zona norte", "Zona oeste", "La Plata", "Provincia de Buenos Aires", "Otra"];

function BuscarMascotas() {
  const [especie, setEspecie] = useState("Perro");

  return (
    <div className="app-layout">
      <AppSidebar />

      <div className="app-main">
        <TopBar />

        <div className="buscar-content">
          <h1>Buscar mascotas</h1>
          <p className="buscar-subtitle">Encontrá la pareja ideal para tu mascota 💚</p>

          <div className="filtros-row">
            <div className="filtro">
              <label>Especie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
                <option value="Perro">🐶 Perro</option>
                <option value="Gato">🐱 Gato</option>
              </select>
            </div>

            <div className="filtro">
              <label>Raza</label>
              <select>
                {razasPorEspecie[especie].map((raza) => (
                  <option key={raza} value={raza}>{raza}</option>
                ))}
              </select>
            </div>

            <div className="filtro">
              <label>Sexo</label>
              <select>
                <option>Todos</option>
                <option>♂ Macho</option>
                <option>♀ Hembra</option>
              </select>
            </div>

            <div className="filtro">
              <label>Edad</label>
              <select>
                {edades.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div className="filtro">
              <label>Tamaño</label>
              <select>
                {tamanos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="filtro">
              <label>Ubicación</label>
              <select>
                {ubicaciones.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="resultados-count">{mascotasEjemplo.length} resultados encontrados</p>

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