"use client";

import React, { useState } from "react";
import styles from "../mvp.module.css";
import Link from "next/link";

export default function NavBar({ title, backHref = "/dashboard", onSettingsClick }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className={styles.navBarWrapper}>
      <div className={styles.navBar}>
        <div className={styles.leftGroup}>
          <div className={styles.brand}>
            <Link href="/dashboard">
              <img
                src="/icons/Omega.svg"
                className={styles.icon}
                alt="Got It Logo"
                width="200"
                height="36"
              />
            </Link>
            <span className={styles.brandText}>{title}</span>
            <button className={styles.bookmarkBtn} onClick={toggleBookmark}>
              <img
                src={
                  isBookmarked
                    ? "/icons/bookMarkTrue.svg"
                    : "/icons/bookMarkFalse.svg"
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
            <button className={styles.settingsBtn} onClick={onSettingsClick}>
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
      <div className={styles.backBtnWrapper}>
        <Link href={backHref} className={styles.backBtnLink}>
          <button className={styles.backBtnContainer}>
            <img
              src="/icons/arrowDown.svg"
              alt="back arrow"
              className={styles.arrow}
            />
            <div className={styles.backBtn}>Go Back</div>
          </button>
        </Link>
      </div>
    </div>
  );
}
