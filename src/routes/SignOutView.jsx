import AuthProvider from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebaseConfig";

export default function SignOutView() {
  const navigate = useNavigate();
  async function handleUserLoggedIn(user) {
    await logout();
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }

  return (
    <AuthProvider
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotLoggedIn={handleUserNotLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
    >
      <div>Loading...</div>
    </AuthProvider>
  );
}
