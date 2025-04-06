import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LoginView from "./routes/LoginView.jsx";
import DashboardView from "./routes/DashboardView.jsx";
import EditProfileView from "./routes/EditProfileView.jsx";
import SignOutView from "./routes/SignOutView.jsx";
import PublicProfileView from "./routes/PublicProfileView.jsx";
import ChooseUsernameView from "./routes/ChooseUsernameView.jsx";

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
  </BrowserRouter>
);
