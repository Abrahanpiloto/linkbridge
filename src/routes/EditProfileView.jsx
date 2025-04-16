import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import AuthProvider from "../components/AuthProvider";
import WrapperMenu from "../components/WrapperMenu";
import {
  getProfilePhotoUrl,
  setUserProfilePhoto,
  updateUser,
} from "../firebase/firebaseConfig";
import style from "../css/editProfileView.module.css";

export default function EditProfileView() {
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);

  const [savedDescription, setSavedDescription] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  const navigate = useNavigate();
  const fileRef = useRef();

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);

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
    const files = e.target.files; //Obtiene los archivos seleccionados por el usuario desde el input
    const fileReader = new FileReader(); //Crea una instancia de FileReader para leer archivos

    //Verifica que existan archivos, que FileReader se haya creado correctamente y que al menos haya un archivo
    if (files && fileReader && files.length > 0) {
      /* ¿Qué significa onload?
      Es una propiedad que actúa como callback: se ejecuta automáticamente cuando el FileReader termina de leer el archivo.*/
      fileReader.onload = async function () {
        /* fileReader.result contiene el resultado de la lectura (en este caso, el ArrayBuffer con los datos del archivo).
        La variable imageData almacena dicho valor para utilizarlo posteriormente. */
        const imageData = fileReader.result; //Obtiene los datos binarios del archivo leído

        //Sube la imagen al servidor (o Firebase en este caso) y guarda el resultado
        const res = await setUserProfilePhoto(currentUser.uid, imageData);
        console.log(res);

        //Si la subida fue exitosa, actualiza los datos del usuario con la nueva ruta de la imagen
        if (res) {
          const tmpUser = { ...currentUser }; //Clona el objeto actual del usuario
          tmpUser.profilePicture = res.metadata.fullPath; //Asigna la nueva ruta de la imagen de perfil

          await updateUser(tmpUser); //Actualiza la información del usuario en la base de datos
          setCurrentUser({ ...tmpUser }); //Actualiza el estado del usuario actual en React

          //Obtiene la URL pública de la imagen para mostrarla en la interfaz
          const url = await getProfilePhotoUrl(currentUser.profilePicture);
          setProfileUrl(url); //Actualiza el estado con la nueva URL de la imagen de perfil
        }
      };
    }
    fileReader.readAsArrayBuffer(files[0]); // Inicia la lectura del primer archivo como un ArrayBuffer (ideal para datos binarios como imágenes)
  }

  function handleDescriptionChange(e) {
    setInputDescription(e.target.value);
  }

  async function handleSaveDescription() {
    const trimmedDescription = inputDescription.trim();

    if (trimmedDescription === "" || trimmedDescription === savedDescription) {
      return;
    }

    try {
      const tmp = { ...currentUser, description: trimmedDescription };
      await updateUser(tmp);
      setSavedDescription(trimmedDescription);
      setInputDescription("");
    } catch (error) {
      console.error("error al actualizar la descripcion:", error);
    }
  }

  // Precargar la imagen de perfil cada vez que profileUrl cambie:
  useEffect(() => {
    if (profileUrl) {
      const img = new Image();
      img.src = profileUrl;
    }
  }, [profileUrl]);

  if (state !== 2) {
    return (
      <AuthProvider
        onUserLoggedIn={handleUserLoggedIn}
        onUserNotLoggedIn={handleUserNotLoggedIn}
        onUserNotRegistered={handleUserNotRegistered}
      >
        <div className={style.loading}>
          <p>Loading...</p>
          <p>Please wait</p>
        </div>
      </AuthProvider>
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
              loading="lazy"
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

          <div className={style.description}>
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

          <button onClick={handleSaveDescription} className={style.buttonSave}>
            Save Description
          </button>
        </div>
      </div>
    </>
  );
}
