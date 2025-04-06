import { useState } from "react";
import AuthProvider from "../components/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { existsUsername, updateUser } from "../firebase/firebaseConfig";
import style from "../css/chooseUsername.module.css";

export default function ChooseUsernameView() {
  const navigate = useNavigate();
  const [state, setState] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState("");

  // Callback para cuando el usuario ya completó el registro:
  function handleUserLoggedIn(user) {
    navigate("/dashboard");
  }
  // Callback para cuando no hay usuario autenticado:
  function handleUserNotLoggedIn() {
    navigate("/login");
  }
  // Callback para cuando el usuario se encuentra autenticado pero no registrado:
  function handleUserNotRegistered(user) {
    setCurrentUser(user);
    setState(3);
  }
  // actualiza el estado del username mientras el usuario escribe en el input:
  function handleInputUsername(e) {
    setUsername(e.target.value);
  }

  async function handleContinue() {
    if (username !== "") {
      const exists = await existsUsername(username);
      if (exists) {
        setState(5);
      } else {
        const tmp = { ...currentUser };
        tmp.username = username;
        tmp.processCompleted = true;
        await updateUser(tmp); //aqui se termina el registro completo del usuario
      }
      setState(6);
    }
  }

  if (state === 3 || state === 5) {
    return (
      <div className={style.chooseUsername}>
        <div className={style.textContainer}>
          <h2>Bienvenido {currentUser.displayName}</h2>
          <p>
            Para completar el proceso, por favor, elige un nombre de usuario.
          </p>
          {state === 5 ? (
            <p>
              Lo siento, el nombre de usuario ya existe, por favor elige otro
            </p>
          ) : (
            ""
          )}
        </div>
        <div>
          <input
            className={style.input}
            type="text"
            onChange={handleInputUsername}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          />
        </div>
        <div>
          <button className={style.btnContinue} onClick={handleContinue}>
            Continuar
          </button>
        </div>
      </div>
    );
  }

  if (state === 6) {
    return (
      <div className={style.congratulations}>
        <h2>
          Felicidades <span className="emoji">🥳</span>ya puedes ir al dashboard
          a crear tus links! <span className="emoji">🚀</span>
        </h2>
        <Link className={style.btnContinue} to="/dashboard">
          Continuar
        </Link>
      </div>
    );
  }
  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >
      ChooseUsernameView
    </AuthProvider>
  );
}
