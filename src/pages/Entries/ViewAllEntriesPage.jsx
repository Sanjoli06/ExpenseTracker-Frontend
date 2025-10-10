import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Tooltip,
  Fab,
  IconButton,
  Paper,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SummaryCard from "../home/SummaryCard";
import AddEntryModal from "../Entries/AddEntryModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function ViewAllEntriesPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch entries:",
        err.response?.data || err.message
      );
      setEntries([]);
    }
  };

  const incomes = entries.filter((e) => e.type === "income");
  const expenses = entries.filter((e) => e.type === "expense");

  const totalIncome = incomes.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );
  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  const balance = totalIncome - totalExpense;

  const handleEdit = (id) => {
    navigate(`/edit-entry/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(entries.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pb: 8,
        background: "#f8fafc",
      }}
    >
      <Container sx={{ flexGrow: 1, mt: 3 }}>
        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<AttachMoneyIcon sx={{ color: "#fff" }} />}
              title="Total Income"
              value={`₹${totalIncome}`}
              bg="linear-gradient(135deg,#1976d2,#42a5f5)"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<AccountBalanceWalletIcon sx={{ color: "#fff" }} />}
              title="Total Expenses"
              value={`₹${totalExpense}`}
              bg="linear-gradient(135deg,#e53935,#ef5350)"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              icon={<AccountBalanceIcon sx={{ color: "#fff" }} />}
              title="Available Balance"
              value={`₹${balance}`}
              bg="linear-gradient(135deg,#43a047,#66bb6a)"
            />
          </Grid>
        </Grid>

        {/* All Entries Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
            All Entries
          </Typography>

          {/* Filter and Controls */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              gap: 2,
            }}
          >
            {/* Filter Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" size="large" color="primary">
                All
              </Button>
              <Button variant="outlined" size="large" color="success">
                Income
              </Button>
              <Button variant="outlined" size="large" color="error">
                Expenses
              </Button>
            </Box>

            {/* Right Side Controls */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  px: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Download Excel
              </Button>

              <select
                style={{
                  padding: "12px 16px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  height: "48px",
                }}
              >
                <option>Sort by Date - Latest</option>
                <option>Sort by Date - Oldest</option>
              </select>
            </Box>
          </Box>

          {/* Entries Grid */}
          <Grid container spacing={3}>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <Grid item xs={12} sm={6} md={4} key={entry._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        borderTop: `5px solid ${
                          entry.type === "income" ? "#4caf50" : "#f44336"
                        }`,
                        minHeight: "180px",
                        height: "70%",
                        width: "330px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          {/* Arrow inside colored box */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 36,
                              height: 36,
                              borderRadius: "6px",
                              backgroundColor:
                                entry.type === "income" ? "#4caf50" : "#f44336",
                              mr: 1,
                            }}
                          >
                            {entry.type === "income" ? (
                              <ArrowUpwardIcon
                                sx={{ color: "#fff", fontSize: 30 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ color: "#fff", fontSize: 30 }}
                              />
                            )}
                          </Box>

                          {/* Title and amount container */}
                          <Box
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold", color: "#333" , fontSize: "1.2rem"}}
                              noWrap
                              title={
                                entry.title ||
                                (entry.type === "income" ? "Income" : "Expense")
                              }
                            >
                              {entry.title ||
                                (entry.type === "income"
                                  ? "Income"
                                  : "Expense")}
                            </Typography>

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color:
                                  entry.type === "income"
                                    ? "#4caf50"
                                    : "#f44336",
                                ml: 2,
                              }}
                            >
                              {entry.type === "income" ? "+" : "-"}₹
                              {entry.amount}
                            </Typography>
                          </Box>
                        </Box>

                        {entry.category && (
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, fontStyle: "italic", color: "#555" }}
                          >
                            {entry.category}
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: "#777" }}
                        >
                          {entry.description || ""}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Divider sx={{ mb: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                          <Box>
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(entry._id)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(entry._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ mt: 3, ml: 2, color: "text.secondary" }}
              >
                No entries available.
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>

      {/* Floating Add Button */}
      <Tooltip title="Add New Entry" arrow>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1200,
          }}
        >
          <Fab
            color="primary"
            onClick={() => setOpenModal(true)}
            sx={{
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0, #1e88e5)",
              },
              width: 60,
              height: 60,
              boxShadow: "0 6px 24px rgba(25,118,210,0.4)",
            }}
          >
            <AddIcon sx={{ fontSize: 32, color: "white" }} />
          </Fab>
        </motion.div>
      </Tooltip>

      {/* Add Entry Modal */}
      <AddEntryModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        onAdded={fetchEntries}
      />
    </Box>
  );
}
