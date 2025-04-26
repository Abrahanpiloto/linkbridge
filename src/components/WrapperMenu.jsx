import { Link } from "react-router-dom";
import style from "../css/wrapper.module.css";
import { useState } from "react";

export default function WrapperMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div className={style.containerWrapper}>
      <img src="/linkbridge-remove.png" alt="Logo" className={style.logo} />

      <button
        className={`${style.hamburger} ${isOpen ? style.open : ""}`}
        onClick={toggleMenu}
      >
        <span className={style.bar}></span>
        <span className={style.bar}></span>
        <span className={style.bar}></span>
      </button>

      <nav className={`${style.nav} ${isOpen ? style.open : ""}`}>
        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
          Links
        </Link>
        <Link to="/dashboard-profile" onClick={() => setIsOpen(false)}>
          Profile
        </Link>
        <Link to="/signout" onClick={() => setIsOpen(false)}>
          Signout
        </Link>
      </nav>

      <div>{children}</div>
    </div>
  );
}
