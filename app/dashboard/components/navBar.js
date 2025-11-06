"use client";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import styles from "../dashboard.module.css";
import Link from "next/link";
import SettingsOverlay from "../../settings/components/SettingsOverlay";

export default function Nav() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <div className={styles.navBar}>
      <div className={styles.leftGroup}>
        <Link href="/dashboard">
          <div className={styles.brand}>
            <img
              src="/icons/gotit.svg"
              className={styles.icon}
              alt="Got It Logo"
              width="200"
              height="36"
            />
          </div>
        </Link>
      </div>
      <div className={styles.rightGroup}>
        <div className={styles.toolIcons}>
          <button
            className={styles.settingsBtn}
            onClick={() => setSettingsOpen(true)}
            type="button"
          >
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
        {/** Settings overlay renders here and handles its own backdrop */}
        <SettingsOverlay
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
