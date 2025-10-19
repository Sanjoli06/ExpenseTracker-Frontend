// src/pages/ForgotPassword/ForgotPasswordPage.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../../utils/services/api";

function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.trim()) return setError("Email is required");

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await sendOtp(email); 
      setMessage(res.data.message || "OTP sent successfully!");
      setStep(2); // move to OTP input
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
  if (!otp.trim()) return setError("Please enter the OTP");

  setLoading(true);
  setError("");
  setMessage("");

  try {
    const res = await verifyOtp(email, otp); 
    setMessage(res.data.message);
    
    // Navigate to Reset Password page with resetToken
    navigate("/reset-password", { state: { resetToken: res.data.resetToken } });

  } catch (err) {
    setError(err.response?.data?.message || "Invalid or expired OTP.");
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
            Update Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          {step === 1 && (
            <>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Enter your registered email to receive an OTP.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                sx={{ mb: 3 }}
              />
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendOtp}
                  disabled={loading}
                  sx={{ py: 1.2, px: 4, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                </Button>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Enter the OTP sent to <strong>{email}</strong>.
              </Typography>
              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Box textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  sx={{ py: 1.2, px: 4, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                </Button>
              </Box>
            </>
          )}
        </motion.div>
      </Paper>
    </Container>
  );
}

export default ForgotPasswordPage;
