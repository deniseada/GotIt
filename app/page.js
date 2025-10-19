import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./NavBar/page";
import MVPPage from "./doc/page";

export default function Home() {
  return (
    <div>
      <NavBar />
      <MVPPage />
    </div>
  );
}
