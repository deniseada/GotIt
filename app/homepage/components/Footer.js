"use client";
import React from "react";
import Image from "next/image";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
    return (
    <footer className={styles.footerWrapper}>
    <div className={styles.leftSection}>
    <Image
    src="/logo.svg"
    width={120}
    height={40}
    alt="Got It Logo"
    />
    </div>
    
    
    <div className={styles.divider}></div>
    
    
    <div className={styles.middleSection}>
    <h4>Learn More</h4>
    <ul>
    <li>
    <Link href="/about">About Us</Link>
    </li>
    <li>
    <Link href="/blogs">Blogs</Link>
    </li>
    </ul>
    </div>
    
    
    <div className={styles.rightSection}>
    <h4>Follow Us</h4>
    <a
    href="https://instagram.com/got_it_connected"
    target="_blank"
    rel="noopener noreferrer"
    >
    <Image
    src="/icons/instagram.svg"
    width={20}
    height={20}
    alt="Instagram Icon"
    />
    @got_it_connected
    </a>
    </div>
    </footer>
    );
    }