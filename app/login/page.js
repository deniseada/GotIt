"use client";

import React from "react";
import styles from "./login.module.css";

// Page linking
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className={styles.authContainer}>
      {/* LEFT SIDE */}
      <div className={styles.authFormSection}>
        <div className={styles.authFormWrapper}>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>
            Start your learning journey in the trades today!
          </p>

          <form>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className={styles.input}
            />

            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={styles.input}
              />
              {/* <span className={styles.icon}>👁️</span> */}
            </div>

            <Link href="/dashboard">
                <button type="submit" className={styles.btnPrimary}>
                Login
                </button>
            </Link>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <Link href="/dashboard">
                <button type="button" className={styles.btnGoogle}>
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google logo"
                />
                Log In with Google
                </button>
            </Link>

            <p className={styles.signinText}>
              Not a member? <Link href="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.authHeroSection}>
        <div className={styles.overlay}>
          <img
            src="/icons/signin.png"
            alt="Hero Image"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <img
            src="icons/omegaWhite.svg"
            alt="Got It logo"
            className={styles.logo}
          />
          <h2 className={styles.heroTitle}>Got It</h2>
          <p className={styles.heroTagline}>
            Confidence starts
            <br />
            with clarity
          </p>
        </div>
      </div>
    </div>
  );
}
