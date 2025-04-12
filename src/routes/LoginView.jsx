import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, userExists, registerNewUser } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import style from "../css/loginView.module.css";

export default function LoginView() {
  const [currentUser, setCurrentUser] = useState(null);
  const [state, setState] = useState(0);
  const navigate = useNavigate();

  /*
    States
    0: inicializado
    1: loading
    2: login completo(autenticado y registrado)
    3: login pero sin registro(autenticado pero no registrado)
    4: no hay nadie logueado(nadie autenticado)
    5: ya existe el username
    6: username elegido satisfactoriamente, click para continuar
    7: username no existe
  */

  async function handleOnClick() {
    const googleProvider = new GoogleAuthProvider();

    async function signInWithGoogle(googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error(error);
      }
    }
    signInWithGoogle(googleProvider);
  }

  function handleUserLoggedIn(user) {
    navigate("/dashboard");
  }
  function handleUserNotLoggedIn() {
    setState(4);
  }
  function handleUserNotRegistered(user) {
    navigate("/choose-username");
  }

  if (state === 4) {
    return (
      <div className={style.loginView}>
        <div>
          <img src="/linkbridge-remove.png" alt="Logo" className={style.logo} />
        </div>{" "}
        <div className={style.textContainer}>
          <p>Un puente hacia tus contenidos.</p>

          <p>Para comenzar, por favor crea tu cuenta.</p>
        </div>
        <button className={style.btn} onClick={handleOnClick}>
          Login with{" "}
          <span className={style.googlelogo}>
            <span className={style.g1}>G</span>
            <span className={style.o1}>o</span>
            <span className={style.o2}>o</span>
            <span className={style.g2}>g</span>
            <span className={style.l}>l</span>
            <span className={style.e}>e</span>
          </span>
        </button>
      </div>
    );
  }
  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >
      <div className={style.loading}>
        <p>Loading...</p>
        <p>Please wait</p>
      </div>
    </AuthProvider>
  );
}
