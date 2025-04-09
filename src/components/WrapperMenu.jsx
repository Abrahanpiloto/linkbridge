import { Link } from "react-router-dom";
import style from "../css/wrapper.module.css";

export default function WrapperMenu({ children }) {
  return (
    <div className={style.container}>
      <div className={style.containerWrapper}>
        <div className={style.logo}>
          <img src="/linkbridge-remove.png" alt="Logo" className={style.logo} />
        </div>

        <nav className={style.nav}>
          <Link to="/dashboard">Links</Link>
          <Link to="/dashboard-profile">Profile</Link>
          <Link to="/signout">Signout</Link>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
