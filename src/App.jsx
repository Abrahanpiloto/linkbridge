import { useNavigate } from "react-router-dom";
import "./App.css";
import style from "./css/home.module.css";
import AuthProvider from "./components/AuthProvider";
import { useState } from "react";

function App() {
  const [state, setState] = useState(0);
  const navigate = useNavigate();

  async function handleUserLoggedIn(user) {
    // setCurrentUser(user);
    setState(2);
    navigate("/dashboard");
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }
  if (state === 0) {
    return (
      <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotLoggedIn={handleUserNotLoggedIn}
        onUserNotRegistered={handleUserNotRegistered}
      >
        <div className={style.loading}>
          <p>Cargando...</p>
          <p>Porfavor espere</p>
        </div>
      </AuthProvider>
    );
  }

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
