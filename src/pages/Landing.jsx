import { Link } from "react-router-dom";
import "./Landing.css";
import logo from "../assets/logo.png";
import carlosImg from "../assets/carlos.png";
import { IconoCorazon } from "../components/Iconos";

function Landing() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* ---------- HEADER ---------- */}
      <header className="landing-header">
        <div className="landing-header-container">
          <Link to="/" className="landing-logo-link">
            <img src={logo} alt="Pet Connection" className="landing-logo" />
          </Link>

          <nav className="landing-nav">
            <button type="button" onClick={() => scrollTo("como-funciona")}>
              Cómo funciona
            </button>
            <button type="button" onClick={() => scrollTo("explorar")}>
              Explorar mascotas
            </button>
            <button type="button" onClick={() => scrollTo("bienestar")}>
              Consejos
            </button>
            <button type="button" onClick={() => scrollTo("contacto")}>
              Cómo contactarnos
            </button>
          </nav>

          <div className="landing-auth-btns">
            <Link to="/registro" className="landing-btn-crear">
              Crear perfil
            </Link>
            <Link to="/login" className="landing-btn-login">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-main">
        {/* ---------- HERO SECTION ---------- */}
        <section className="landing-hero" id="explorar">
          <div className="landing-hero-left">
            <span className="landing-tag">ENCONTRÁ UNA CONEXIÓN PARA TU MASCOTA</span>
            <h1 className="landing-hero-title">Una conexión especial empieza acá.</h1>
            <p className="landing-hero-text">
              Conectá con otros dueños y encontrá mascotas compatibles para una cría responsable.
            </p>
            <Link to="/registro" className="landing-hero-cta">
              Explorar mascotas
            </Link>
            <p className="landing-hero-subtext">Perfiles · Filtros · Contacto entre dueños</p>
          </div>

          <div className="landing-hero-right">
            <div className="landing-card-preview">
              <img src={carlosImg} alt="Carlos" className="landing-card-img" />
              <div className="landing-card-body">
                <h3>Carlos</h3>
                <p className="landing-card-detail">🐾 Golden</p>
                <p className="landing-card-detail">📅 4 años</p>
                <p className="landing-card-detail">♂ Macho</p>
                <p className="landing-card-detail">📍 Palermo, BsAs</p>

                <div className="landing-card-footer">
                  <Link to="/login" className="landing-card-btn">
                    Ver perfil
                  </Link>

                  <button type="button" className="landing-card-fav">
                    <IconoCorazon activo={true} />
                  </button>
                </div>
              </div>
            </div>
            <div className="landing-hero-shadow-shape"></div>
          </div>
        </section>

        {/* ---------- PASOS ---------- */}
        <section className="landing-steps" id="como-funciona">
          <h2 className="landing-section-title">Simple, claro y en pocos pasos</h2>
          <p className="landing-section-sub">Todo lo que necesitás para empezar a buscar.</p>

          <div className="landing-steps-grid">
            <div className="landing-step-card">
              <span className="landing-step-badge">01</span>
              <h3>Creá el perfil</h3>
              <p>Agregá los datos de tu mascota.</p>
            </div>

            <div className="landing-step-card">
              <span className="landing-step-badge">02</span>
              <h3>Usá los filtros</h3>
              <p>Buscá por especie, raza, edad y zona.</p>
            </div>

            <div className="landing-step-card">
              <span className="landing-step-badge">03</span>
              <h3>Conectá con dueños</h3>
              <p>Conocé el perfil y contactá a la otra persona.</p>
            </div>
          </div>
        </section>

        {/* ---------- LO QUE IMPORTA ---------- */}
        <section className="landing-features">
          <h2 className="landing-section-title">Encontrá lo que importa</h2>

          <div className="landing-features-grid">
            <div className="landing-feature-item">
              <div className="landing-feature-icon">🔍</div>
              <h3>Perfiles detallados</h3>
              <p>Conocé datos importantes de cada mascota.</p>
            </div>

            <div className="landing-feature-item">
              <div className="landing-feature-icon">✓</div>
              <h3>Búsqueda con filtros</h3>
              <p>Acotá resultados según tus preferencias.</p>
            </div>

            <div className="landing-feature-item">
              <div className="landing-feature-icon">↗</div>
              <h3>Contacto directo</h3>
              <p>Hablá con otros dueños desde un mismo lugar.</p>
            </div>
          </div>
        </section>

        {/* ---------- BIENESTAR ---------- */}
        <section className="landing-wellness" id="bienestar">
          <h2>El bienestar va primero</h2>
          <p>
            La reproducción debe planificarse con responsabilidad. Consultá con un veterinario para
            revisar la salud, la edad y las condiciones de ambas mascotas.
          </p>
          <div className="landing-wellness-pill">Salud · Compatibilidad · Bienestar</div>
        </section>

        {/* ---------- AYUDA Y CONTACTO ---------- */}
        <section className="landing-help" id="contacto">
          <span className="landing-tag">¿TENÉS DUDAS? HABLEMOS</span>
          <h2>Estamos para ayudarte.</h2>
          <p className="landing-help-desc">
            ¿Querés saber más sobre Pet Connection o necesitás ayuda para empezar? Escribinos y te
            orientamos.
          </p>

          <div className="landing-help-box">
            <span className="landing-help-label">ESCRIBINOS POR MAIL</span>
            <strong className="landing-help-email">hola@petconnection.com</strong>
            <p>Para consultas, sugerencias o soporte.</p>
          </div>

          <p className="landing-help-footer-text">
            Pet Connection promueve conexiones responsables, priorizando siempre la salud y
            bienestar de las mascotas.
          </p>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-footer-brand">
            <h3>Pet Connection</h3>
            <p>Conectando dueños, cuidando mascotas.</p>
          </div>

          <div className="landing-footer-links">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Inicio
            </button>
            <button type="button" onClick={() => scrollTo("como-funciona")}>
              Cómo funciona
            </button>
            <button type="button" onClick={() => scrollTo("explorar")}>
              Explorar
            </button>
            <button type="button" onClick={() => scrollTo("contacto")}>
              Contacto
            </button>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p>© 2026 Pet Connection</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;