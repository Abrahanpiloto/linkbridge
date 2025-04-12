import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import AuthProvider from "../components/AuthProvider";
import WrapperMenu from "../components/WrapperMenu";
import {
  getProfilePhotoUrl,
  setUserProfilePhoto,
  updateUser,
} from "../firebase/firebaseConfig";
import style from "../css/editProfileView.module.css";

export default function EditProfileView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);
  const fileRef = useRef();

  // Estado para la descripción guardada (preview) y para el input de texto
  const [savedDescription, setSavedDescription] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);
    // Si el usuario ya cuenta con descripción, se la asigna al estado local
    setSavedDescription(user.description || "");
    setInputDescription("");
    setState(2);
  }
  function handleUserNotLoggedIn() {
    navigate("/login");
  }
  function handleUserNotRegistered(user) {
    navigate("/login");
  }

  function handleOpenPicker() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  async function handleChangeFile(e) {
    const files = e.target.files;
    const fileReader = new FileReader();

    if (files && fileReader && files.length > 0) {
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = async function () {
        const imageData = fileReader.result;
        const res = await setUserProfilePhoto(currentUser.uid, imageData);
        console.log(res);
        // actualizacion de profilePicture en la informacion del usuario en la db, para poder obtener la url de la imagen y poder renderizarla en pantalla:
        if (res) {
          const tmpUser = { ...currentUser };
          tmpUser.profilePicture = res.metadata.fullPath;
          await updateUser(tmpUser);
          setCurrentUser({ ...tmpUser });
          const url = await getProfilePhotoUrl(currentUser.profilePicture);
          setProfileUrl(url);
        }
      };
    }
  }

  // funcion para actualizar el estado local del campo description mientras se escribe:
  function handleDescriptionChange(e) {
    setInputDescription(e.target.value);
  }

  // funcion para guardar la descripcion actualizada en la db firebase y actualiza la UI:
  async function handleSaveDescription() {
    const tmp = { ...currentUser, description: inputDescription };

    await updateUser(tmp);
    setSavedDescription(inputDescription);
    setInputDescription("");
  }
  if (state !== 2) {
    return (
      <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotLoggedIn={handleUserNotLoggedIn}
        onUserNotRegistered={handleUserNotRegistered}
      ></AuthProvider>
    );
  }

  return (
    <>
      <WrapperMenu />
      <div className={style.container}>
        <div className={style.content}>
          <p className={style.title}>Edit Profile Info</p>

          <div className={style.imageContainer}>
            <img
              src={profileUrl}
              alt="Profile"
              width={100}
              className={style.image}
            />
            <button onClick={handleOpenPicker} className={style.buttonEdit}>
              <span className="material-icons" style={{ fontSize: "20px" }}>
                edit
              </span>
            </button>
          </div>

          <div>
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleChangeFile}
            />
          </div>
          <p>{currentUser.username}</p>
          {/* Seccion de descripcion */}
          <div className={style.description}>
            {/* Se muestra el texto guardado (preview) solo si el input está vacío */}
            {!inputDescription && savedDescription && (
              <div className={style.showDescription}>
                <p>{savedDescription}</p>
              </div>
            )}
            <textarea
              className={style.textarea}
              id="description"
              name="description"
              rows="4"
              maxLength="150"
              value={inputDescription}
              onChange={handleDescriptionChange}
              style={{ width: "100%", resize: "none" }}
              placeholder="Write here your description, your tastes, whatever you want!"
            />
          </div>

          {/* Boton de guardado de la descripcion */}
          <button onClick={handleSaveDescription} className={style.buttonSave}>
            Save Description
          </button>
        </div>
      </div>
    </>
  );
}
