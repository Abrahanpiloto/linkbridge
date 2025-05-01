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
  const [loading, setLoading] = useState(false);
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
      <div className={styles.cargando}>
        <h4>Cargando por favor espere</h4>
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

    // <div className={styles.container}>
    //   <div className={styles.card}>
    //     <div className={styles.image}>
    //       <img src={url} alt="photo user" width={110} />
    //     </div>
    //     <div className={styles.text}>
    //       <h2>{profile?.profileInfo?.username}</h2>
    //       <div className={styles.description}>
    //         <p>{profile?.profileInfo?.description}</p>
    //       </div>
    //     </div>

    //     <div className={styles.containerLinks}>
    //       {profile?.linksInfo.map((link) => (
    //         <div key={link.docId} className={styles.linkItem}>
    //           <PublicLink url={link.url} title={link.title} />
    //         </div>
    //       ))}
    //     </div>
    //     <div className={styles.linkBridge}>
    //       <p>
    //         Hecho en{" "}
    //         <span>
    //           <a
    //             href={"https://linkbridge.netlify.app"}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //           >
    //             LinkBridge
    //           </a>
    //         </span>
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
}
