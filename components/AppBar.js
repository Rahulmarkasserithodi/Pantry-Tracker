import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AppBarComponent() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: "grey.400" }}>
          Pantry Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
