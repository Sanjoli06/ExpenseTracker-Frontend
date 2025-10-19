// src/pages/ForgotPassword/ResetPasswordPage.jsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../../utils/services/api";

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
   const { resetToken } = location.state || {}; // get resetToken from state
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Both fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

     if (!resetToken) {
      setError("No reset token found. Please restart the process.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(resetToken, password);
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000); // redirect after 2s
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Reset Password
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your new password below.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ py: 1.2, px: 4, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </Box>
        </motion.div>
      </Paper>
    </Container>
  );
}

export default ResetPasswordPage;
