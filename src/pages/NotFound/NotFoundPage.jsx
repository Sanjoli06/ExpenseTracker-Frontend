// src/pages/NotFoundPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700, color: "#1976d2" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2, color: "#555" }}>
        Oops! Page not found.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          mt: 2,
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          "&:hover": { background: "linear-gradient(135deg, #1565c0, #1e88e5)" },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}
