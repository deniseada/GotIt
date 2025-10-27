import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import NavBar from "./doc/components/NavBar";
import MVPPage from "./doc/page";
import SideBar from "./doc/components/sideBar";
import Dashboard from "./dashboard/page";
import GotItHomepage from "./homepage/page";
import Link from "next/link";

export default function Home() {
  return <div>
    <GotItHomepage />
    {/* <Dashboard /> */}
  </div>;
}
