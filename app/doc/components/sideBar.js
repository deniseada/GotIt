import styles from "../mvp.module.css";

export default function SideBar({
  title = "Unit 1: Atomic Structure",
  items = [],
}) {
  // Default items if none provided
  const defaultItems = [
    { href: "#early-history", label: "Early History of Electricity" },
    { href: "#Atoms", label: "Atoms" },
    {
      href: "#the-law-of-charges",
      label: "The Law of Charges",
    },
    {
      href: "#structure-of-the-atom",
      label: "Structure of the Atom",
    },
    { href: "#electron-orbits", label: "Electron Orbits" },
    { href: "#valence-electrons", label: "Valence Electrons" },
    { href: "#electron-flow", label: "Electron Flow" },
    { href: "#insulators", label: "Insulators" },
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarHeader}>
        <h2 className={styles.sideBarTitle}>{title}</h2>
      </div>

      <nav className={styles.sideBarNav}>
        <ul className={styles.sideBarList}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.sideBarItem}>
              <a href={item.href} className={styles.sideBarLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
