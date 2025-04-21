import styles from "../css/publicLink.module.css";

export default function PublicLink({ url, title }) {
  const targetUrl = url.match(/^https?:\/\//i) ? url : `https://${url}`;
  return (
    <div>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.publicLink}
      >
        {title}
      </a>
    </div>
  );
}
