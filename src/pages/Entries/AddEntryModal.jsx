import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AddEntryModal({ open, handleClose, onAdded }) {
  const [formData, setFormData] = useState({
    type: "Expense",
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    paidVia: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/entries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      setSuccess(true);
      onAdded(); // refresh list
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1200);
    } catch (err) {
      console.error("Error adding entry:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 50 },
            transition: { duration: 0.35, ease: "easeOut" },
            style: {
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            },
          }}
          sx={{
            "& .MuiBackdrop-root": {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
        >
          {/* Title bar */}
          <DialogTitle
            sx={{
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#1976d2",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              pb: 1,
            }}
          >
            Add Entry
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Success animation */}
          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  flexDirection: "column",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 70, color: "#2e7d32", mb: 1 }}
                />
                <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                  Entry Added Successfully!
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Fields */}
          {!success && (
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="Expense">Expense</MenuItem>
                    <MenuItem value="Income">Income</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Price (₹)"
                    fullWidth
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Date"
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="Paid Via"
                    fullWidth
                    name="paidVia"
                    value={formData.paidVia}
                    onChange={handleChange}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Notes (optional)"
                    fullWidth
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          )}

          {/* Footer buttons */}
          {!success && (
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleClose} variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1565c0, #1e88e5)",
                  },
                  minWidth: 100,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
