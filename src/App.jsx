import { useNavigate } from "react-router-dom";
import "./App.css";

import style from "./css/home.module.css";

function App() {
  const navigate = useNavigate();

  function handleOnClick(e) {
    navigate("/login");
  }
  return (
    <div className={style.container}>
      <div className={style.left}>
        <h1>¡Descubre LinkBridge!</h1>

        <p>
          Organiza todos tus links en una única tarjeta digital, con un diseño
          minimalista y elegante. Ideal para profesionales, emprendedores,
          creadores de contenido y cualquier persona que quiera conectar de
          manera efectiva sus redes y recursos. ¡Haz de tus enlaces un puente
          hacia tu mundo digital!
        </p>
      </div>

      <button onClick={handleOnClick} className={style.loginBtn}>
        <span className="material-icons" style={{ fontSize: "48px" }}>
          login
        </span>
      </button>

      <div className={style.right}>
        <img src="/linkbridge-remove.png" alt="Logo" className={style.logo} />
        <p>Un puente hacia tus contenidos.</p>
      </div>
    </div>
  );
}

export default App;
