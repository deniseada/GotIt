"use client";

import React from "react";
import styles from "./login.module.css";

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

            <button type="submit" className={styles.btnPrimary}>
              Login
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <button type="button" className={styles.btnGoogle}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
              />
              Sign Up with Google
            </button>

            <p className={styles.signinText}>
              Not a member? <a href="/login">Sign Up</a>
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
