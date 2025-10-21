import styles from "../sideBar.module.css";

export default function SideBar() {
  return (
    <div className={styles.sideBar}>
      <div className={styles.sideBarHeader}>
        <h2 className={styles.sideBarTitle}>Part V: Circuits</h2>
      </div>

      <nav className={styles.sideBarNav}>
        <ul className={styles.sideBarList}>
          <li className={styles.sideBarItem}>
            <a href="#circuits-overview" className={styles.sideBarLink}>
              Circuits Overview
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#power-circuit" className={styles.sideBarLink}>
              Power Circuit
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#control-circuit-source" className={styles.sideBarLink}>
              Control Circuit's Source of Supply
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a
              href="#automatic-control-circuits"
              className={styles.sideBarLink}
            >
              Automatic Control Circuits
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#sump-pump-circuit" className={styles.sideBarLink}>
              Sump-Pump Circuit
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#reservoir-circuit" className={styles.sideBarLink}>
              Reservoir Circuit
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#manual-circuits" className={styles.sideBarLink}>
              Manual Circuits
            </a>
          </li>
          <li className={styles.sideBarItem}>
            <a href="#three-wire-circuit" className={styles.sideBarLink}>
              Three-Wire Circuit
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
