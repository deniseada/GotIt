import styles from "../dashboard.module.css";

export default function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search for books, sections, or sources"
      />
    </div>
  );
}
