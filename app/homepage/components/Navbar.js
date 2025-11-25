"use client";
import React from "react";
import Image from "next/image";
import styles from "../homepage.module.css";

/**
 * Navbar
 * Simple top navigation with links.
 */
export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Image
          src="/logo/Logo.svg"
          alt="Got It logo"
          width={140}
          height={42}
          priority
        />
        <span className={styles.navbarBrandText}></span>
      </div>

      <nav className={styles.navLinks}>
        <a
          href="https://dwong429.wixsite.com/gotit/about"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          About Us
        </a>
        <a
          href="https://dwong429.wixsite.com/gotit"
          className={styles.navLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Blogs
        </a>
      </nav>
    </header>
  );
}
