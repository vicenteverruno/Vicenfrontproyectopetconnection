import logo from "../assets/logo.png";
import perros from "../assets/perros.png";
import iconoEscudo from "../assets/icono-escudo.png";
import iconoChat from "../assets/icono-chat.png";

function AuthSidebar() {
  return (
    <aside className="auth-sidebar">
      <img src={logo} alt="Pet Connection" className="auth-logo-img" />

      <h1 className="auth-sidebar-title">
        Encontrá el compañero ideal para tu mascota
      </h1>

      <ul className="auth-features">
        <li>
          <img src={iconoEscudo} alt="" className="auth-feature-icon-img" />
          <div>
            <strong>Perfiles verificados</strong>
            <p>Usuarios y mascotas verificados para tu seguridad.</p>
          </div>
        </li>
        <li>
          <img src={iconoChat} alt="" className="auth-feature-icon-img" />
          <div>
            <strong>Chat seguro</strong>
            <p>Contactá con otros dueños de forma segura y fácil.</p>
          </div>
        </li>
      </ul>

      <img src={perros} alt="Perros" className="auth-sidebar-image" />
    </aside>
  );
}

export default AuthSidebar;