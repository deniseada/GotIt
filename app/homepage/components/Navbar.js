"use client";
import React from "react";
import styles from "../homepage.module.css";

/**
 * Navbar
 * Simple top navigation with links.
 */
export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <a href="#" className={styles.navLink}>
        About Us
      </a>
      <a
        href="https://dwong429.wixsite.com/gotit"
        className={styles.navLink}
        target="_blank"
        rel="Blogs"
      >
        Blogs
      </a>
    </header>
  );
}
