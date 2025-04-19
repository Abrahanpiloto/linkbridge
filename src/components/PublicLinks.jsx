import styles from "../css/publicLink.module.css";

export default function PublicLink({ url, title }) {
  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.publicLink}
      >
        {title}
      </a>
    </div>
  );
}
