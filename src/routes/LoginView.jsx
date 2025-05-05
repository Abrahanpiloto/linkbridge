import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import style from "../css/loginView.module.css";

export default function LoginView() {
  const [loading, setLoading] = useState(false);
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

  function handleUserLoggedIn(user) {
    setLoading(false);
    navigate("/dashboard");
  }

  function handleUserNotRegistered(user) {
    setLoading(false);
    navigate("/choose-username");
  }

  function handleUserNotLoggedIn() {
    setLoading(false);
  }

  async function handleOnClick() {
    setLoading(true);

    const googleProvider = new GoogleAuthProvider();

    // Forzamos always-select-account
    googleProvider.setCustomParameters({ prompt: "select_account" });

    try {
      // 2) Abrimos el popup,luego onAuthStateChanged en AuthProvider hará el navigate
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login falló:", error);
      setLoading(false);
    }
  }

  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >
      {" "}
      {loading ? (
        <div className={style.loading}>
          <p>Cargando...</p>
          <p>Por favor espere</p>
        </div>
      ) : (
        <div className={style.loginView}>
          <div className={style.leftContent}>
            <div>
              <img src="/linkbridge.jpg" alt="Logo" className={style.logo} />
            </div>
            <div className={style.textContainer}>
              <p>Un puente hacia tus contenidos.</p>
              <p>
                Organiza todos tus links en una tarjeta digital con un diseño
                minimalista y elegante. Ideal para profesionales, emprendedores,
                creadores de contenido y cualquier persona que quiere conectar
                de manera efectiva todas sus redes sociales y recursos.
                <br />
                ¡Haz de tus enlaces un puente hacia tu mundo digital!
              </p>
            </div>
          </div>

          <div className={style.rightContent}>
            <div>
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
        </div>
      )}
    </AuthProvider>
  );
}
