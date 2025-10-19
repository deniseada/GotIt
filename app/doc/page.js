import React from "react";
import DocScreen from "./components/DocScreen";
import styles from "./mvp.module.css";

export default function MVPPage() {
  return (
    <main className={styles.container}>

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
          <DocScreen />
        </div>
      </section>
      
    </main>
  );
}
