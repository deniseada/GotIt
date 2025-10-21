import React from "react";
import DocScreen from "./components/DocScreen";
import styles from "./mvp.module.css";
import ToolBar from "./components/ToolBar";

export default function MVPPage() {
  return (
    <div>
      <main className={styles.container}>
        <section className={styles.viewerArea}>
          <div className={styles.viewerCenter}>
            <DocScreen />
          </div>
        </section>
        
      </main>
    </div>
  );
}
