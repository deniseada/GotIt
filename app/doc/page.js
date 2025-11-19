import React from "react";
import DocScreen from "./components/DocScreen";
import styles from "./mvp.module.css";
import Link from "next/link";

export default function MVPPage() {
  return (
    <div>
      <main className={styles.container}>
        <div className={styles.viewerCenter}>
          <DocScreen />
        </div>
      </main>
    </div>
  );
}
