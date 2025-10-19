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
            <span className={styles.brandText}>Doc Title</span>
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
        <div className={styles.toolbarInner}>
          <div className={styles.toolbarLeft}>
            <button className={styles.toolButton}>
              <img
                src="/icons/sideBarIcon.svg"
                className={styles.toolbarIcon}
              />
            </button>

            <button className={styles.toolButton}>
              <img
                src="/icons/sideCompareIcon.svg"
                className={styles.toolbarIcon}
              />
            </button>
            <button className={styles.toolButton}>
              <img src="/icons/searchIcon.svg" className={styles.toolbarIcon} />
            </button>
          </div>

          <div className={styles.toolbarRight}>
            <button className={styles.toolButton}>
              <img
                src="/icons/highlightIcon.svg"
                className={styles.toolbarIcon}
              />
            </button>
            <button className={styles.toolButton}>
              <img src="/icons/textIcon.svg" className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolButton}>
              <img src="/icons/addPicIcon.svg" className={styles.toolbarIcon} />
            </button>
            <button className={styles.toolButton}>
              <img src="/icons/printIcon.svg" className={styles.toolbarIcon} />{" "}
            </button>
            <button className={styles.toolButton}>
              <img
                src="/icons/downloadIcon.svg"
                className={styles.toolbarIcon}
              />
            </button>
            <button className={styles.toolButton}>
              <img src="/icons/moreIcon.svg" className={styles.toolbarIcon} />
            </button>
          </div>
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
