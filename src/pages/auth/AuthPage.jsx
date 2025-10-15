import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage({ onLogin }) { // ✅ accept onLogin callback from App.js
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (isSignup && !form.name.trim()) {
      tempErrors.name = "Name is required";
    }
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Invalid email address";
    }
    if (!form.password) {
      tempErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      tempErrors.password =
        "Password must be at least 8 characters, including uppercase, lowercase, number, and special character";
    }
    if (isSignup && form.password !== form.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    return tempErrors;
  };

  const handleSubmit = async () => {
    const tempErrors = validateForm();
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      setApiError("");
      return;
    }

    setLoading(true);
    setApiError("");
    setErrors({});

    try {
      if (isSignup) {
        await axios.post("http://localhost:5000/api/auth/signup", {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        // Clear form and switch to login
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        setIsSignup(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email.trim(),
          password: form.password,
        });
        
        // ✅ store token and inform App.js
        localStorage.setItem("token", res.data.token);
        if (onLogin) onLogin(res.data.token); // 🔑 tell App.js token changed

        navigate("/home");
        return; // exit early to prevent any flicker
      }
    } catch (err) {
      if (err.response?.data?.field) {
        setErrors({ [err.response.data.field]: err.response.data.message });
      } else {
        setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setApiError("");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        staggerChildren: 0.2,
        ease: "easeOut",
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <motion.div
          key={isSignup ? "signup" : "login"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={childVariants}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              {isSignup ? "Sign Up" : "Login"}
            </Typography>
          </motion.div>

          {apiError && (
            <motion.div variants={childVariants}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            </motion.div>
          )}

          {isSignup && (
            <motion.div variants={childVariants}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                autoFocus
              />
            </motion.div>
          )}

          <motion.div variants={childVariants}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete={isSignup ? "new-password" : "current-password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>

          {isSignup && (
            <motion.div variants={childVariants}>
              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          )}

          <motion.div variants={childVariants}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : isSignup ? "Sign Up" : "Login"}
            </Button>
          </motion.div>

          <motion.div variants={childVariants}>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </Typography>
              <Button
                onClick={toggleForm}
                sx={{ mt: 1, textTransform: "none" }}
                color="primary"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Button>
            </Box>
          </motion.div>
        </motion.div>
      </Paper>
    </Container>
  );
}

export default AuthPage;
