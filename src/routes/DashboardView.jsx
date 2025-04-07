import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import { useState } from "react";
import DashboardWrapper from "../components/DasboarWrapper";
import {
  deleteLink,
  getLinks,
  insertNewLink,
  updateLink,
} from "../firebase/firebaseConfig";
import Link from "../components/Link";
import style from "../css/dashboard.module.css";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function DashboardView() {
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);

  const navigate = useNavigate();

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    setState(2);
    const resLinks = await getLinks(user.uid);
    setLinks([...resLinks]);
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
        <div>Loading...</div>
      </AuthProvider>
    );
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    addLink();
  }

  async function addLink() {
    if (title !== "" && url !== "") {
      const newLink = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: title,
        url: url,
        uid: currentUser.uid,
      };
      const res = await insertNewLink(newLink);
      newLink.docId = res.id;
      setTitle("");
      setUrl("");
      setLinks([...links, newLink]);
    }
  }

  function handleOnChange(e) {
    const value = e.target.value;
    if (e.target.name === "title") {
      setTitle(value);
    }
    if (e.target.name === "url") {
      setUrl(value);
    }
  }
  async function handleUpdateLink(docId, title, url) {
    const link = links.find((item) => item.docId === docId);
    link.title = title;
    link.url = url;
    await updateLink(docId, link);
  }

  async function handleDeleteLink(docId) {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este card?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            await deleteLink(docId);
            const tmp = links.filter((link) => link.docId !== docId);
            setLinks([...tmp]);
          },
        },
        {
          label: "No",
          // Si se selecciona "No", no se realiza ninguna acción.
        },
      ],
    });
  }
  return (
    <div className={style.container}>
      <div className={style.containerWrapper}>
        <DashboardWrapper />
      </div>
      <div className={style.containerDouble}>
        <div className={style.formContainer}>
          <h1>Crea tus enlaces aquí</h1>
          <form
            className={style.containerForm}
            action=""
            onSubmit={handleOnSubmit}
          >
            <label htmlFor="title">Titulo</label>
            <input
              type="text"
              name="title"
              onChange={handleOnChange}
              value={title}
            />
            <label htmlFor="url">Url</label>
            <input
              type="text"
              name="url"
              onChange={handleOnChange}
              value={url}
            />
            <input
              className={style.buttonCreateLink}
              type="submit"
              value="Create new link"
            />
          </form>
        </div>

        <div className={style.containerLinks}>
          {links.map((link) => (
            <Link
              key={link.docId}
              docId={link.docId}
              url={link.url}
              title={link.title}
              onUpdate={handleUpdateLink}
              onDelete={handleDeleteLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
