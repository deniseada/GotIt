import React from "react";
import Link from "next/link";

import Simplification from "./components/Simplification";
import Summarization from "./components/Summarization";

export default function AIFeatures() {
    return (
        <div>
            <Simplification />
            <Summarization />
        </div>
    );
}