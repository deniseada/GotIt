import styles from "./mvp.module.css";

export default function MVPPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MVP Page</h1>
      <p className={styles.description}>
        This is a sample MVP page using CSS Modules for styling.
      </p>
    </div>
  );
}
