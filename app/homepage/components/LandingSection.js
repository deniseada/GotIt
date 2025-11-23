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
                    src='/icons/landingPageSmile.jpg'
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

            {/* FEATURE ROW */}
            <div className={styles.features}>
                <h2>Our Key Features</h2>

                <div className={styles.featureRow}>
                    <div className={styles.feature}>
                        <Image
                            src='/icons/LandingSimplification.svg'
                            width={64}
                            height={64}
                            alt='Text Simplification'
                            className={styles.featureIcon}
                        />
                        <h4>Text Simplification</h4>
                        <p>Breaks down dense manuals into plain language.</p>
                    </div>

                    <div className={styles.feature}>
                        <Image
                            src='/icons/LandingSummary.svg'
                            width={64}
                            height={64}
                            alt='Summarization Tool'
                            className={styles.featureIcon}
                        />
                        <h4>Summarization Tool</h4>
                        <p>Turns long readings into quick study notes.</p>
                    </div>

                    <div className={styles.feature}>
                        <Image
                            src='/icons/LandingMindMap.svg'
                            width={64}
                            height={64}
                            alt='Mind-Map Generator'
                            className={styles.featureIcon}
                        />
                        <h4>Mind-Map Generator</h4>
                        <p>Converts information into visual learning aids.</p>
                    </div>
                </div>

                <p className={styles.andMore}>and much more!</p>
            </div>

            {/* LAPTOP MOCKUP */}
            <div className={styles.laptopSection}>
                <Image
                    src='/icons/openDoc.svg'
                    alt='Got It Tool Demo on Laptop'
                    width={1400}
                    height={900}
                    className={styles.laptopImage}
                />
            </div>


            <div className="styles.mobileSection">
                <div>
                    <h2>
                        Got It values your learning wherever you are
                    </h2>
                    <p> Available in mobile device for easy access!</p>
                    <p>Built for apprentices who learn in school, on the job, and on the move.</p>
                </div>


            </div>
        </section>
    );
}
