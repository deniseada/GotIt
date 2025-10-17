import styles from "./mvp.module.css";

export default function MVPPage() {
  return (
    <main className={styles.container}>
      <div className={styles.navBar}>
        <div className={styles.leftGroup}>
          <div className={styles.brand}>
            <img
              src="/icons/Omega.svg"
              className={styles.icon}
              alt="Got It Logo"
              width="200"
              height="36"
            />
            <img
              src="/icons/doc.svg"
              className={styles.gotItImage}
              alt="Got It Logo"
              width="200"
              height="36"
            />
          </div>
        </div>

        <div className={styles.rightGroup}>
          <div className={styles.toolIcons}>
            <button className={styles.settingsBtn}>
              <img
                src="/icons/gear.svg"
                alt="settings"
                className={styles.gearImg}
                width="20"
                height="20"
              />
              <span className={styles.settingsLabel}>Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolBar}>
        <div className={styles.toolbarIcons}>
          <button className={styles.toolButton}>
            <img
              src="/icons/sideBarIcon.svg"
              alt="sidebar"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/searchIcon.svg"
              alt="search"
              className={styles.toolbarIcon}
            />
          </button>
          <button className={styles.toolButton}>
            <img
              src="/icons/sideCompareIcon.svg"
              alt="side compare"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/highlightIcon.svg"
              alt="highlight"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img src="/icons/lineSpaceIcon.svg" alt="line space" />
          </button>
          <button className={styles.toolButton}>
            <img
              src="/icons/textIcon.svg"
              alt="text"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/drawIcon.svg"
              alt="draw"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/addPicIcon.svg"
              alt="add picture"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/printIcon.svg"
              alt="print"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/downloadIcon.svg"
              alt="download"
              className={styles.toolbarIcon}
            />
          </button>

          <button className={styles.toolButton}>
            <img
              src="/icons/moreIcon.svg"
              alt="more"
              className={styles.toolbarIcon}
            />
          </button>
        </div>
      </div>

      <section className={styles.viewerArea}>
        <div className={styles.viewerCenter}>
          <div className={styles.pdfBoxLarge}>PDF CONTENT (placeholder)</div>
        </div>
      </section>
    </main>
  );
}
