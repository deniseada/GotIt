import React from "react";
import Link from "next/link";

import Simplification from "./components/Simplification";
import Summarization from "./components/Summarization";
import MindMap from "./components/MindMap";

export default function AIFeatures() {
    return (
        <div>
            <Simplification />
            <Summarization />
            <MindMap />
        </div>
    );
}