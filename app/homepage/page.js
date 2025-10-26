"use client";
import React from "react";
import Image from "next/image";
import styles from "./homepage.module.css";
import Navbar from "./components/Navbar";
import HoverSwap from "./components/HoverSwap";

/**
 * Homepage: left column (logo + text + CTA),
 *           right column (hover-swap image)
 */
export default function GotItHomepage() {
  return (
    <div className={styles.page}>
      {/* top navigation */}
      <Navbar />

      {/* main 2-column layout */}
      <main className={styles.container}>
        {/* left side: brand + tagline + CTA */}
        <section className={styles.leftCol}>
          <Image
            src="/logo/Logo.svg"
            alt="Got It Logo"
            width={360}
            height={110.12}
            priority
          />
          <p className={styles.tagline}>
            Confidence starts
            <br />
            with clarity
          </p>
          <button className={styles.cta}>Sign Up</button>
        </section>

        {/* right side: hover-swap image */}
        <section className={styles.rightCol}>
          <HoverSwap
            frontSrc="/images/paper-a.png"
            backSrc="/images/paper-b.png"
            altFront="Manual Circuit — long text"
            altBack="Manual Circuit — simplified bullets"
          />
        </section>
      </main>
    </div>
  );
}
