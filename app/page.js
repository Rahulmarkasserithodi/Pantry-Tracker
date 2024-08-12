"use client";

import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import AppBarComponent from "@/components/AppBar";
import Sidebar from "@/components/Sidebar";
import Inventory from "@/components/Inventory";
import Products from "@/components/Products";
import Distribution from "@/components/Distribution";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "linear-gradient(135deg, #000000, #222222)",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  shadows: Array(25).fill("0px 4px 20px rgba(0, 0, 0, 0.5)"),
});

export default function App() {
  const [selectedSection, setSelectedSection] = useState("Inventory");

  const renderContent = () => {
    switch (selectedSection) {
      case "Inventory":
        return <Inventory />;
      case "Products":
        return <Products />;
      case "Distribution":
        return <Distribution />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <AppBarComponent />
        <Sidebar setSelectedSection={setSelectedSection} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: "240px",
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
