import Image from "next/image";
import styles from "./page.module.css";
import React from "react";
import MVPPage from "./mvp/page";

export default function Home() {
  return (
    <div>
      <MVPPage />
    </div>
  );
}
