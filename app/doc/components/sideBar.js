import styles from "../mvp.module.css";

export default function SideBar({ title = "Part V: Circuits", items = [] }) {
  // Default items if none provided
  const defaultItems = [
    { href: "#circuits-overview", label: "Circuits Overview" },
    { href: "#power-circuit", label: "Power Circuit" },
    {
      href: "#control-circuit-source",
      label: "Control Circuit's Source of Supply",
    },
    {
      href: "#automatic-control-circuits",
      label: "Automatic Control Circuits",
    },
    { href: "#sump-pump-circuit", label: "Sump-Pump Circuit" },
    { href: "#reservoir-circuit", label: "Reservoir Circuit" },
    { href: "#manual-circuits", label: "Manual Circuits" },
    { href: "#three-wire-circuit", label: "Three-Wire Circuit" },
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
