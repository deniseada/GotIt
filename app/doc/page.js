import React from "react";
import DocScreen from "./components/DocScreen";
import styles from "./mvp.module.css";

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
