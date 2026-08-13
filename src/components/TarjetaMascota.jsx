function TarjetaMascota({ imagen, nombre, raza, edad, sexo, ubicacion }) {
    return (
      <div className="tarjeta-mascota">
        <img src={imagen} alt={nombre} className="tarjeta-mascota-img" />
  
        <div className="tarjeta-mascota-info">
          <h3>{nombre}</h3>
          <p>🐾 {raza}</p>
          <p>📅 {edad}</p>
          <p>{sexo === "Macho" ? "♂" : "♀"} {sexo}</p>
          <p>📍 {ubicacion}</p>
  
          <div className="tarjeta-mascota-footer">
            <button className="tarjeta-mascota-btn">Ver perfil</button>
            <span className="tarjeta-mascota-fav">🤍</span>
          </div>
        </div>
      </div>
    );
  }
  
  export default TarjetaMascota;