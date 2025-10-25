import React from "react";
import NavBar from "../doc/components/NavBar";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

export default function Dashboard() {

    // Sample cards for the dashboard
    const cards = [
        { id: "timer", title: "Timer" },
        { id: "ai", title: "AI Assistant" },
        { id: "vocab", title: "Vocabulary" },
    ];

    return ( 
        <div>
            <NavBar />
            <section className="p-6 grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
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
            </section>
        </div>
    );
}