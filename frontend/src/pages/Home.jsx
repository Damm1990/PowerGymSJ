import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.png";
import logo from "../assets/logoPowerGymSJ.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="overlay" />

      {/* contenido */}
      <div className="home-content">
        <img src={logo} alt="PowerGymSJ" className="logo" />

        <h1>Bienvenido al panel de administrador</h1>

        <h2>PowerGymSJ</h2>

        <h2>
          Gestioná socios, planes y control del gimnasio desde un solo lugar.
        </h2>

        <button
          className="btn-success"
          onClick={() => navigate("/socios")}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Home;