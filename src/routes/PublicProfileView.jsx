import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  existsUsername,
  getProfilePhotoUrl,
  getUserPublicProfileInfo,
} from "../firebase/firebaseConfig";
import PublicLink from "../components/PublicLinks";
import styles from "../css/publicProfileView.module.css";
import UserProfileCard from "../components/UserProfileCard";

export default function PublicProfileView() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(0);

  useEffect(() => {
    getProfile();
    async function getProfile() {
      const username = params.username; //obtiene el nombre de usuario de la url

      try {
        const userUid = await existsUsername(username);
        if (userUid) {
          const userInfo = await getUserPublicProfileInfo(userUid);
          setProfile(userInfo);

          const url = await getProfilePhotoUrl(
            userInfo.profileInfo.profilePicture
          );
          setUrl(url);
          console.log(profile);
        } else {
          setState(7);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [params]);

  if (loading) {
    return (
      <div className={styles.containerLoader}>
        <span className={styles.loader}></span>
      </div>
    );
  }

  if (state === 7) {
    return (
      <div className={styles.noUser}>
        <img
          src="/public/not-user.png"
          alt="Usuario no encontrado"
          className={styles.noUserImage}
        />
        <h2>Disculpe, pero el usuario no existe</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UserProfileCard url={url} profile={profile} />
    </div>
  );
}
