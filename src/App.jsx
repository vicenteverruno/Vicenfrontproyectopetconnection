import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Inicio from "./pages/Inicio";
import BuscarMascotas from "./pages/BuscarMascotas";
import PerfilMascota from "./pages/PerfilMascota";
import MiMascota from "./pages/MiMascota";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/Configuracion";
import CambiarPassword from "./pages/CambiarPassword";
import AyudaSoporte from "./pages/AyudaSoporte";
import Favoritos from "./pages/Favoritos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/buscar" element={<BuscarMascotas />} />
        <Route path="/mascota/:id" element={<PerfilMascota />} />
        <Route path="/mi-mascota" element={<MiMascota />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/cambiar-contrasena" element={<CambiarPassword />} />
        <Route path="/ayuda-soporte" element={<AyudaSoporte />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;