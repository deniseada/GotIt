// app/doc/layout.js
import NavBar from "./components/NavBar";

export default function DocLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar backHref="/dashboard" />
            <main className="flex-1">{children}</main>
        </div>
    );
}