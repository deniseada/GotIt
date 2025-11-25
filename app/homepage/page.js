"use client";
import React from "react";
import Image from "next/image";
import styles from "./homepage.module.css";
import Navbar from "./components/Navbar";
import HoverSwap from "./components/HoverSwap";
import Link from "next/link";
import LandingSection from "./components/LandingSection";
import Footer from "./components/Footer"
import FloatingLines from './components/FloatingLines';

export default function GotItHomepage() {
  return (
    // 1. Ensure the parent has relative positioning
    <div className={styles.page} style={{ position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
      </div>

      {/* --- MAIN SECTION WITH FLOATING LINES --- */}
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* --- BACKGROUND LAYER (Fixed to main section only) --- */}
        <div 
          style={{
            position: 'absolute',    // Positioned relative to main section
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',          // Full width of main section
            height: '100%',         // Full height of main section
            zIndex: 0               // Behind content (content has zIndex: 1, so it's still clickable)
          }}
        >
          <FloatingLines />
          {/* Gradient overlay to blend to black - more aggressive */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 120% 120% at center, transparent 0%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0.5) 50%, rgb(0, 0, 0) 75%, rgb(4, 3, 3) 100%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* --- FOREGROUND CONTENT LAYER --- */}
        <main className={styles.container} style={{ position: 'relative', zIndex: 1 }}>
          <section className={styles.leftCol}>
              
              <p className={styles.tagline}>
              Electrical Theory,
                <br />
                Simplified.
              </p>
              <p className={styles.subTagline}>
              No jargon. No confusion. Just a smart AI tool that helps electrical apprentices learn faster, retain more, and stress less.
              </p>
            <Link href="/signup">
              <button className={styles.cta}>Sign Up</button>
            </Link>
          </section>

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
      {/* End Main Section with Floating Lines */}
        
      <LandingSection />
      <Footer />

    </div>
  );
}