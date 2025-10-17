"use client";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import "./styles/globals.css";

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
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* resets default browser styles */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
