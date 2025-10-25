"use client";
import React from "react";
import Image from "next/image";
import styles from "./homepage.module.css";
import localFont from "next/font/local";

export default function GotItHomepage() {
  return (
    <div className={styles.page}>
      {/* Top Nav */}
      <header className={styles.navbar}>
        <a href="#" className={styles.navLink}>
          About Us
        </a>
        <a href="#" className={styles.navLink}>
          Blogs
        </a>
      </header>

      <main className={styles.container}>
        <section className={styles.leftCol}>
          <Image
            src="/logo/Logo.svg"
            alt="Got It Logo"
            width={400}
            height={122}
          />

          <p className={styles.tagline}>
            Confidence starts
            <br />
            with clarity
          </p>

          <button className={styles.cta}>Sign Up</button>
        </section>
      </main>
    </div>
  );
}

/* (ถ้าจะใช้โลโก้เป็น SVG component เอง อันนี้ใช้ได้ ไม่ต้องแตะ) */
function LogoMark({ width = 400, height = 122, color = "#fff" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={width}
      height={height}
      fill="none"
      stroke={color}
    >
      <path
        d="M24 10h16l12 14v16L40 54H24L12 40V24L24 10Z"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M22 32l10 12 10-12-10-12-10 12Z"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
