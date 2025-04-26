import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LoginView from "./routes/LoginView.jsx";
import DashboardView from "./routes/DashboardView.jsx";
import EditProfileView from "./routes/EditProfileView.jsx";
import SignOutView from "./routes/SignOutView.jsx";
import PublicProfileView from "./routes/PublicProfileView.jsx";
import ChooseUsernameView from "./routes/ChooseUsernameView.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/dashboard" element={<DashboardView />} />
      <Route path="/dashboard-profile" element={<EditProfileView />} />
      <Route path="/signout" element={<SignOutView />} />
      <Route path="u/:username" element={<PublicProfileView />} />
      <Route path="/choose-username" element={<ChooseUsernameView />} />
    </Routes>
    <ToastContainer
      // position="bottom-left"
      position="top-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
    />
  </BrowserRouter>
);

/* NOTA IMPORTANTE
en React Router la sintaxis :username es solo para definir el parámetro en el código, no va con el colon (:) en la URL real.
El :username le dice a React Router “coge lo que vaya después de /u/ y mételo en useParams().username”.
No forma parte literal de la URL.
Ejemplo:
http://localhost:5173/u/abrahan
/u/ → coincide con la parte estática u/ de tu ruta.
abrahan → coincide con el parámetro :username.
*/
