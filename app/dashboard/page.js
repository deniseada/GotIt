import React from "react";
// import NavBar from "../doc/components/NavBar";
import { Box, Typography } from "@mui/material";

// Components
import Nav from "./components/navBar";
import SearchBar from "./components/searchBar";
import UploadButton from "./components/uploadButton";
import TabBar from "./components/tabBar";

// Page linking
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <SearchBar />
      <TabBar />

      {/* <NavBar /> */}
      <p>Hi there from the dashboard!</p>
    </div>
  );
}
