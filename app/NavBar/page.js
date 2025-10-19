import React from "react";
import styles from "./NavBar.module.css";

export default function NavBar() {
    return (


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
    );
}