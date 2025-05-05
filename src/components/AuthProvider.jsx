import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  registerNewUser,
  userExists,
  db,
  getUserInfo,
} from "../firebase/firebaseConfig";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function AuthProvider({
  children,
  onUserLoggedIn,
  onUserNotLoggedIn,
  onUserNotRegistered,
}) {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {

  //     if (user) {
  //       const exists = await userExists(user.uid);
  //       if (exists) {
  //         const userInfo = await getUserInfo(user.uid);
  //         if (userInfo.processCompleted) {
  //           onUserLoggedIn(userInfo);
  //         } else {
  //           onUserNotRegistered(userInfo);
  //         }
  //       } else {
  //         // al momento de autenticarse se hace un preregistro con valores predefinidos:
  //         await registerNewUser({
  //           uid: user.uid,
  //           displayName: user.displayName,
  //           profilePicture: "",
  //           username: "",
  //           description: "",
  //           processCompleted: false,
  //         });
  //         onUserNotRegistered(user);
  //       }
  //     } else {
  //       onUserNotLoggedIn();
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1️⃣ Saltamos la primera llamada (inicialización)

      if (user) {
        const isRegistered = await userExists(user.uid);

        if (isRegistered) {
          const userInfo = await getUserInfo(user.uid);
          if (userInfo.processCompleted) {
            onUserLoggedIn(userInfo);
          } else {
            onUserNotRegistered(userInfo);
          }
        } else {
          // al momento de autenticarse se hace un preregistro con valores predefinidos:
          await registerNewUser({
            uid: user.uid,
            displayName: user.displayName,
            profilePicture: "",
            username: "",
            description: "",
            processCompleted: false,
          });
          // luego se redirige a la vista de eleccion de nombre de usuario osera choose-username:
          onUserNotRegistered(user);
        }
      } else {
        // si aun no se ha autenticado ningun usuario se redirige a login:
        onUserNotLoggedIn();
      }
    });
    return () => unsubscribe();
  }, [onUserLoggedIn, onUserNotLoggedIn, onUserNotRegistered]);

  return <>{children}</>;
}
