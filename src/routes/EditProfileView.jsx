import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import AuthProvider from "../components/AuthProvider";
import WrapperMenu from "../components/WrapperMenu";
import {
  getProfilePhotoUrl,
  setUserProfilePhoto,
  updateUser,
} from "../firebase/firebaseConfig";

export default function EditProfileView() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [state, setState] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);
  const fileRef = useRef();

  async function handleUserLoggedIn(user) {
    setCurrentUser(user);
    const url = await getProfilePhotoUrl(user.profilePicture);
    setProfileUrl(url);
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
    <WrapperMenu>
      <div>
        <h2 className="h1">Edit Profile Info</h2>
        <div>
          <div>
            <img src={profileUrl} alt="" width={100} />
          </div>
          <div>
            <button onClick={handleOpenPicker}>
              Choose new profile picture
            </button>
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleChangeFile}
            />
          </div>
        </div>
      </div>
    </WrapperMenu>
  );
}
