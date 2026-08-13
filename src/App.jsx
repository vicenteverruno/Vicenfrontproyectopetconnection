import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import BuscarMascotas from "./pages/BuscarMascotas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/buscar" element={<BuscarMascotas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;