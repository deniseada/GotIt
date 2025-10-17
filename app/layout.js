"use client";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"], // required
  weight: ["400", "500", "700"], // choose weights you need
  variable: "--font-space-grotesk", // optional custom CSS variable
});

const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* resets default browser styles */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
