// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (!user)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Box textAlign="center" sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                margin: "0 auto",
                bgcolor: "primary.main",
                fontSize: "2.2rem",
              }}
            >
              {user.name ? user.name[0].toUpperCase() : "U"}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              {user.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || "No email available"}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Account Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>User ID:</strong> {user.id || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Role:</strong> {user.role || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Joined:</strong>{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unknown"}
            </Typography>
          </Box>
        </motion.div>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
