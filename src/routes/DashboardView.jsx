import { useNavigate } from "react-router-dom";
import AuthProvider from "../components/AuthProvider";
import { useState } from "react";
import WrapperMenu from "../components/WrapperMenu";
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

import { toast } from "react-toastify";

export default function DashboardView() {
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);

  const navigate = useNavigate();

  // Lista de clases a asignar cíclicamente
  const colorClass = [style.cardColor1, style.cardColor2, style.cardColor3];
  const publicUrl = `${window.location.origin}/u/${currentUser.username}`;

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
        <div className={style.containerLoader}>
          <span className={style.loader}></span>
        </div>
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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        toast.success("¡Enlace copiado al portapapeles!");
      })
      .catch(() => {
        toast.error("Hubo un error al copiar el enlace.");
      });
  };

  return (
    <>
      <WrapperMenu />
      <div className={style.container}>
        <div className={style.containerDouble}>
          <div className={style.formContainer}>
            <h2>Crea tus enlaces aquí</h2>
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

            {/* Sección para compartir el card URL LinkBridge*/}
            <div className={style.publicLinkBox}>
              <h5>Tu enlace para compartir es este:</h5>
              <div className={style.copyContainer}>
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className={style.publicLinkInput}
                />
                <button className={style.btnCopy} onClick={handleCopy}>
                  Copiar
                </button>
              </div>
            </div>
          </div>

          <div className={style.containerLinks}>
            {links.slice(0, 6).map((link, index) => {
              return (
                <Link
                  key={link.docId}
                  docId={link.docId}
                  url={link.url}
                  title={link.title}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                  colorClass={colorClass[index % colorClass.length]} // Se pasa la clase dinámica
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
