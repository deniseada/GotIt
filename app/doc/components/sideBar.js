import styles from "../mvp.module.css";

export default function SideBar({
  title = "Unit 1: Atomic Structure",
  items = [],
  onNavigateToPage,
}) {
  // Default items with page numbers
  const defaultItems = [
    { page: 2, label: "Early History of Electricity" },
    { page: 4, label: "Atoms" },
    { page: 8, label: "Law of Charges" },
    { page: 9, label: "Structure of the Atom" },
    { page: 11, label: "Electron Orbits" },
    { page: 13, label: "Valence Electrons" },
    { page: 14, label: "Electron Flow" },
    { page: 19, label: "Insulators" },
    { page: 19, label: "Semiconductors" },
    { page: 20, label: "Molecules" },
    { page: 21, label: "Methods of Producing Electricity" },
    { page: 22, label: "Electrical Effects" },
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  const handleClick = (e, page) => {
    e.preventDefault();
    if (onNavigateToPage && typeof onNavigateToPage === "function") {
      onNavigateToPage(page);
    }
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarHeader}>
        <h2 className={styles.sideBarTitle}>{title}</h2>
      </div>

      <nav className={styles.sideBarNav}>
        <ul className={styles.sideBarList}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.sideBarItem}>
              <a
                href="#"
                className={styles.sideBarLink}
                onClick={(e) => handleClick(e, item.page)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
