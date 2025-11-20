import styles from "../dashboard.module.css";
import Image from "next/image";

export default function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInputWrapper}>
        <Image
          src="/icons/searchIcon.svg"
          alt="Search"
          width={20}
          height={20}
          className={styles.searchIcon}
        />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for books, sections, or sources"
        />
      </div>
    </div>
  );
}
