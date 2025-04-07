import { useState, useRef, useEffect } from "react";
import style from "../css/link.module.css";

export default function Link({ docId, onDelete, onUpdate, title, url }) {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentUrl, setCurrentUrl] = useState(url);

  const [editTitle, setEditTitle] = useState(false);
  const [editUrl, setEditUrl] = useState(false);

  // se usa useRef para crear una referencia a un elemento html, en este caso sera cuando se de click al boton de edit y se cambie al input
  const titleRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [editTitle]);

  useEffect(() => {
    if (urlRef.current) {
      urlRef.current.focus();
    }
  }, [editUrl]);

  function handleEditTitle() {
    setEditTitle(true);
  }

  function handleEditUrl() {
    setEditUrl(true);
  }

  function handleChangeTitle(e) {
    setCurrentTitle(e.target.value);
  }

  function handleChangeUrl(e) {
    setCurrentUrl(e.target.value);
  }

  function handleBlurTitle(e) {
    setEditTitle(false);
    onUpdate(docId, currentTitle, currentUrl);
  }

  function handleBlurUrl(e) {
    setEditUrl(false);
    onUpdate(docId, currentTitle, currentUrl);
  }

  function handleEnterTitle(e) {
    if (e.key === "Enter") {
      onUpdate(docId, currentTitle, currentUrl);

      setEditTitle(false);
    }
  }

  function handleEnterUrl(e) {
    if (e.key === "Enter") {
      onUpdate(docId, currentTitle, currentUrl);

      setEditUrl(false);
    }
  }

  function handleDeleteLink() {
    onDelete(docId);
  }
  return (
    <div key={docId} className={style.cardLink}>
      <div>
        <div className={style.textRow}>
          {editTitle ? (
            <>
              <input
                ref={titleRef}
                value={currentTitle}
                onChange={handleChangeTitle}
                onBlur={handleBlurTitle}
                onKeyDown={handleEnterTitle}
              />
            </>
          ) : (
            <>
              <span className={style.textContent}>{currentTitle}</span>

              <button onClick={handleEditTitle} className={style.iconEdit}>
                <span className="material-icons" style={{ fontSize: "16px" }}>
                  edit
                </span>
              </button>
            </>
          )}
        </div>

        <div className={style.textRow}>
          {editUrl ? (
            <>
              <input
                ref={urlRef}
                value={currentUrl}
                onChange={handleChangeUrl}
                onBlur={handleBlurUrl}
                onKeyDown={handleEnterUrl}
              />
            </>
          ) : (
            <>
              <span className={style.textContent}>{currentUrl}</span>

              <button onClick={handleEditUrl} className={style.iconEdit}>
                <span className="material-icons" style={{ fontSize: "16px" }}>
                  edit
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <button onClick={handleDeleteLink} className={style.iconDelete}>
          <span className="material-icons" style={{ fontSize: "16px" }}>
            delete
          </span>
        </button>
      </div>
    </div>
  );
}
