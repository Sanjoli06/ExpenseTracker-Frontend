import React, { useState, useEffect } from "react";
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
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { createEntry } from "../../utils/services/api";

export default function AddEntryModal({ open, handleClose, onAdded, editingEntry }) {
  const isEditMode = Boolean(editingEntry);

  const [formData, setFormData] = useState({
    type: "expense",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    paidVia: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Prefill data when editing
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        type: editingEntry.type,
        title: editingEntry.title || "",
        amount: editingEntry.amount || "",
        date: editingEntry.date?.split("T")[0] || new Date().toISOString().split("T")[0],
        category: editingEntry.category || "",
        paidVia: editingEntry.paidVia || "",
        notes: editingEntry.notes || "",
      });
    } else {
      setFormData({
        type: "expense",
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paidVia: "",
        notes: "",
      });
    }
  }, [editingEntry]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    console.log("hiiiiiiiiiiiii")
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isEditMode) {
        // ✅ Update existing entry
        await axios.put(`http://localhost:5000/api/entries/${editingEntry._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // ✅ Create new entry
        await createEntry(formData);
      }

      setLoading(false);
      setSuccess(true);
      onAdded(); // refresh list
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 1200);
    } catch (err) {
      console.error("Error saving entry:", err.response?.data || err.message);
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
            {isEditMode ? "Edit Entry" : "Add Entry"}
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

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
                <CheckCircleOutlineIcon sx={{ fontSize: 70, color: "#2e7d32", mb: 1 }} />
                <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                  {isEditMode ? "Entry Updated!" : "Entry Added!"}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <DialogContent dividers sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField select fullWidth label="Type" name="type" value={formData.type} onChange={handleChange}>
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField label="Title" fullWidth name="title" value={formData.title} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <TextField label="Price (₹)" fullWidth name="amount" type="number" value={formData.amount} onChange={handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <TextField label="Date" fullWidth name="date" type="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>

                <Grid item xs={6}>
                  <TextField select label="Category" fullWidth name="category" value={formData.category} onChange={handleChange}>
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField select label="Paid Via" fullWidth name="paidVia" value={formData.paidVia} onChange={handleChange}>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField label="Notes (optional)" fullWidth name="notes" value={formData.notes} onChange={handleChange} multiline rows={2} />
                </Grid>
              </Grid>
            </DialogContent>
          )}

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
                  "&:hover": { background: "linear-gradient(135deg, #1565c0, #1e88e5)" },
                  minWidth: 100,
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : isEditMode ? "Update" : "Submit"}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
