import React from "react";
// import NavBar from "../doc/components/NavBar";
import { Box, Typography } from "@mui/material";

// Components
import Nav from "./components/navBar";
import SearchBar from "./components/searchBar";
import UploadButton from "./components/uploadButton";
import TabBar from "./components/tabBar";
import StudyGuideButton from "./components/StudyGuideButton";

// Page linking
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Nav />
      <SearchBar />
      <TabBar />
      {/* <section className="p-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                {cards.map((c) => (
                    <Link
                    key={c.id}
                    href="/doc"
                    className="rounded-lg border p-4 hover:shadow"
                    >
                    <h2 className="font-semibold">{c.title}</h2>
                    <p className="text-sm opacity-80">Open {c.title}</p>
                    </Link>
                ))}
            </section> */}
      {/* <NavBar /> */}
      <StudyGuideButton />
    </div>
  );
}
