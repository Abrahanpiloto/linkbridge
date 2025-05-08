import PublicLink from "./PublicLinks";
import styles from "../css/userProfileCard.module.css";

export default function UserProfileCard({ url, profile }) {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={url} alt="photo user" width={110} />
      </div>
      <div className={styles.text}>
        <h2 className={styles.username}>{profile?.profileInfo?.username}</h2>
        <div className={styles.description}>
          <p>{profile?.profileInfo?.description}</p>
        </div>
      </div>

      <div className={styles.containerLinks}>
        {profile?.linksInfo.map((link) => (
          <div key={link.docId} className={styles.linkItem}>
            <PublicLink url={link.url} title={link.title} />
          </div>
        ))}
      </div>
      <div className={styles.linkBridge}>
        <p>
          Hecho en{" "}
          <span>
            <a
              href={"https://linkbridge.netlify.app"}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkBridge
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
