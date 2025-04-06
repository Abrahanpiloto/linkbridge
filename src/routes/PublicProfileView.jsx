import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  existsUsername,
  getProfilePhotoUrl,
  getUserPublicProfileInfo,
} from "../firebase/firebaseConfig";
import PublicLink from "../components/PublicLinks";

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
    return <h4>Loading please wait...</h4>;
  }

  if (state === 7) {
    return (
      <div>
        <h2>El usuario no existe</h2>
      </div>
    );
  }

  return (
    <div>
      <h3>Public Profile View</h3>
      <div>
        <img src={url} alt="photo user" width={110} />
      </div>
      <h2>{profile?.profileInfo?.username}</h2>
      <h3>{profile?.profileInfo?.displayName}</h3>
      <div>
        {profile?.linksInfo.map((link) => (
          <PublicLink key={link.docId} url={link.url} title={link.title} />
        ))}
      </div>
    </div>
  );
}
