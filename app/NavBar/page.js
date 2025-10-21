"use client";

import React, { useState } from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className={styles.navBarWrapper}>
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
            <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
              <img
                src={
                  isBookmarked
                    ? "/icons/bookmarkTrue.svg"
                    : "/icons/bookmarkFalse.svg"
                }
                alt="bookmark"
                className={styles.bookmarkImg}
                width="20"
                height="20"
              />
            </button>
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
      <button className={styles.backBtnContainer}>
        <img
          src="/icons/arrowDown.svg"
          alt="back arrow"
          className={styles.arrow}
        />
        <div> Go back</div>
      </button>
    </div>
  );
}
