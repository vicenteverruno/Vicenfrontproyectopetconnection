import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Inicio from "./pages/Inicio";
import BuscarMascotas from "./pages/BuscarMascotas";
import PerfilMascota from "./pages/PerfilMascota";
import Comentarios from "./pages/Comentarios";
import MiMascota from "./pages/MiMascota";
import Notificaciones from "./pages/Notificaciones";
import Configuracion from "./pages/Configuracion";
import AyudaSoporte from "./pages/AyudaSoporte";
import Favoritos from "./pages/Favoritos";
import MiPerfil from "./pages/MiPerfil";
import Avisos from "./components/Avisos";

function App() {
  return (
    <BrowserRouter>
      <Avisos />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/buscar" element={<BuscarMascotas />} />
        <Route path="/mascota/:id" element={<PerfilMascota />} />
        <Route path="/mascota/:id/comentarios" element={<Comentarios />} />
        <Route path="/mi-mascota" element={<MiMascota />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="/ayuda-soporte" element={<AyudaSoporte />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;