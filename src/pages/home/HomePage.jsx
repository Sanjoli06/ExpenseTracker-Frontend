import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Home Page 🎉
      </Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
}

export default HomePage;
