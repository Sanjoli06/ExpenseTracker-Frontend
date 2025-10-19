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
import { createEntry, updateEntry } from "../../utils/services/api";

export default function AddEntryModal({
  open,
  handleClose,
  onAdded,
  editingEntry,
}) {
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        type: editingEntry.type,
        title: editingEntry.title || "",
        amount: editingEntry.amount || "",
        date:
          editingEntry.date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
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
    setErrors({});
  }, [editingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > 45) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.paidVia) newErrors.paidVia = "Payment method is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (isEditMode) {
       await updateEntry(editingEntry._id, formData);
      } else {
        await createEntry(formData);
      }

      setLoading(false);
      setSuccess(true);
      onAdded();
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
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.8, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.8, y: 50 },
            transition: { duration: 0.35, ease: "easeOut" },
            sx: {
              borderRadius: 3,
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              m: { xs: 1, sm: "auto" },
              maxWidth: { xs: "95%", sm: 600 },
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
              pb: 1.5,
              pt: 1.5,
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
                  px: 2,
                  py: 2,
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 70, color: "#2e7d32", mb: 1 }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#2e7d32", fontWeight: 700 }}
                >
                  {isEditMode ? "Entry Updated!" : "Entry Added!"}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <DialogContent
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2 },
                "& .MuiGrid-root": { margin: 0 },
                "& .MuiGrid-item": { padding: { xs: "8px 0 0 0", sm: "16px 8px 0 0" } },
              }}
            >
              <Grid
                container
                spacing={{ xs: 1.5, sm: 2 }}
                sx={{
                  width: "100%",
                  margin: 0,
                }}
              >
                {/* Row 1: Type + Title - Adjusted for better balance */}
                <Grid item xs={12} sm={5}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="expense">Expense</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Title"
                    fullWidth
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={Boolean(errors.title)}
                    helperText={errors.title || `${formData.title.length}/45`}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Row 2: Amount + Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price (₹)"
                    fullWidth
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    error={Boolean(errors.amount)}
                    helperText={errors.amount}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.date)}
                    helperText={errors.date}
                  />
                </Grid>

                {/* Row 3: Category + Paid Via - Ensured labels are prominent */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    error={Boolean(errors.category)}
                    helperText={errors.category || "Select a category"}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Travel">Travel</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Paid Via "
                    name="paidVia"
                    value={formData.paidVia}
                    onChange={handleChange}
                    error={Boolean(errors.paidVia)}
                    helperText={errors.paidVia || "Select payment method"}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </TextField>
                </Grid>

                {/* Row 4: Notes */}
                <Grid item xs={12}>
                  <TextField
                    label="Notes (optional)"
                    fullWidth
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          )}

          {!success && (
            <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, justifyContent: "space-between" }}>
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
                ) : isEditMode ? (
                  "Update"
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