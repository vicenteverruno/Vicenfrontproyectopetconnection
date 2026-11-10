import logo from "../assets/logo.png";
import perros from "../assets/perros.png";
import iconoPata from "../assets/icono-pata.png";
import iconoCorazon from "../assets/icono-corazon.png";

function AuthSidebar() {
  return (
    <aside className="auth-sidebar">
      <img src={logo} alt="Pet Connection" className="auth-logo-img" />

      <h1 className="auth-sidebar-title">
        Encontrá el compañero ideal para tu mascota
      </h1>

      <ul className="auth-features">
        <li>
          <img src={iconoPata} alt="" className="auth-feature-icon-img" />
          <div>
            <strong>Mascotas cerca tuyo</strong>
            <p>Buscá por especie, raza, sexo, tamaño y ubicación.</p>
          </div>
        </li>
        <li>
          <img src={iconoCorazon} alt="" className="auth-feature-icon-img" />
          <div>
            <strong>Hacé match</strong>
            <p>Si las dos mascotas se dan like, ¡hay match!</p>
          </div>
        </li>
      </ul>

      <img src={perros} alt="Perros" className="auth-sidebar-image" />
    </aside>
  );
}

export default AuthSidebar;
