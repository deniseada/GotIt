"use client";
import React from "react";
import Image from "next/image";
import styles from "./LandingSection.module.css";

export default function LandingSection() {
    return (
        <section className={styles.wrapper}>
            {/* HERO SECTION */}
            <div className={styles.hero}>
                <Image
                    src='/images/worker-hero.jpg'
                    alt='Construction apprentice smiling'
                    width={1800}
                    height={900}
                    className={styles.heroImage}
                />

                <div className={styles.heroTextBox}>
                    <h2>Got It is created by and for students</h2>
                    <p>
                        Designed with empathy and experience, it bridges the gap
                        between classroom theory and hands-on practice.
                    </p>
                    <p className={styles.subtext}>
                        Studying made simpler, smarter, and more accessible for
                        everyone.
                    </p>
                </div>
            </div>

            {/* LAPTOP MOCKUP */}
            <div className={styles.laptopSection}>
                <Image
                    src='/images/laptop-mock.png' 
                    alt='Got It Tool Demo on Laptop'
                    width={1400}
                    height={900}
                    className={styles.laptopImage}
                />
            </div>

            {/* FEATURE ROW */}
            <div className={styles.features}>
                <h3>Our Key Features</h3>

                <div className={styles.featureRow}>
                    <div className={styles.feature}>
                        <Image
                            src='/icons/star.svg'
                            width={40}
                            height={40}
                            alt='Text Simplification'
                        />
                        <h4>Text Simplification</h4>
                        <p>Breaks down dense manuals into plain language.</p>
                    </div>

                    <div className={styles.feature}>
                        <Image
                            src='/icons/doc.svg'
                            width={40}
                            height={40}
                            alt='Summarization Tool'
                        />
                        <h4>Summarization Tool</h4>
                        <p>Turns long readings into quick study notes.</p>
                    </div>

                    <div className={styles.feature}>
                        <Image
                            src='/icons/map.svg'
                            width={40}
                            height={40}
                            alt='Mind-Map Generator'
                        />
                        <h4>Mind-Map Generator</h4>
                        <p>Converts information into visual learning aids.</p>
                    </div>
                </div>

                <p className={styles.andMore}>and much more!</p>
            </div>
        </section>
    );
}
