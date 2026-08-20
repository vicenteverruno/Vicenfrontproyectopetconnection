import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import BuscarMascotas from "./pages/BuscarMascotas";
import PerfilMascota from "./pages/PerfilMascota";
import MiMascota from "./pages/MiMascota";
import Notificaciones from "./pages/Notificaciones";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/buscar" element={<BuscarMascotas />} />
        <Route path="/mascota/:id" element={<PerfilMascota />} />
        <Route path="/mi-mascota" element={<MiMascota />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;