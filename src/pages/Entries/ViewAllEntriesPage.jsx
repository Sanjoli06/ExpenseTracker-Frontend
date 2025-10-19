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
import { deleteEntry, getEntries } from "../../utils/services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewAllEntriesPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await getEntries();
      setEntries(res.data || []);
    } catch (err) {
      console.error(
        "Failed to fetch entries:",
        err.response?.data || err.message
      );
      setEntries([]);
      toast.error("Failed to fetch entries!");
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      setEntries(entries.filter((e) => e._id !== id));
      toast.success("Entry deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete entry!");
    }
  };

  // 🔹 Filter logic
  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.type === filter);

  // 🔹 Sort logic
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  // 🔹 Summary calculations
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
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

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

          {/* Filter + Sort Controls */}
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
              {/* All Button */}
              <Button
                variant="outlined"
                size="large"
                color="primary"
                sx={{
                  background:
                    filter === "all"
                      ? "linear-gradient(135deg, rgba(25,118,210,0.15), rgba(66,165,245,0.15))"
                      : "transparent",
                  color: "#1976d2",
                  borderColor: "#1976d2",
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => setFilter("all")}
              >
                All
              </Button>

              {/* Income Button */}
              <Button
                variant="outlined"
                size="large"
                color="success"
                sx={{
                  background:
                    filter === "income"
                      ? "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(129,199,132,0.15))"
                      : "transparent",
                  color: "#2e7d32",
                  borderColor: "#2e7d32",
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => setFilter("income")}
              >
                Income
              </Button>

              {/* Expense Button */}
              <Button
                variant="outlined"
                size="large"
                color="error"
                sx={{
                  background:
                    filter === "expense"
                      ? "linear-gradient(135deg, rgba(229,57,53,0.15), rgba(244,67,54,0.15))"
                      : "transparent",
                  color: "#c62828",
                  borderColor: "#c62828",
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={() => setFilter("expense")}
              >
                Expenses
              </Button>
            </Box>

            {/* Sort + Download */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* <Button
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
              </Button> */}

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  padding: "12px 16px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  height: "48px",
                  cursor: "pointer",
                }}
              >
                <option value="latest">Sort by Date - Latest</option>
                <option value="oldest">Sort by Date - Oldest</option>
              </select>
            </Box>
          </Box>

          {/* Entries Grid */}
          <Grid container spacing={3}>
            {sortedEntries.length > 0 ? (
              sortedEntries.map((entry, index) => (
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
                        background:
                          entry.type === "income"
                            ? "linear-gradient(180deg, #f1fbf5 0%, #ffffff 100%)"
                            : "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
                        borderTop: `5px solid ${
                          entry.type === "income" ? "#55a558ff" : "#da8e89ff"
                        }`,
                        minHeight: "180px",
                        width: "335px",
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
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 36,
                              height: 36,
                              borderRadius: "6px",
                              backgroundColor:
                                entry.type === "income"
                                  ? "rgba(76,175,80,0.12)"
                                  : "rgba(244,67,54,0.12)",
                              mr: 1,
                            }}
                          >
                            {entry.type === "income" ? (
                              <ArrowUpwardIcon
                                sx={{ color: "#2e7d32", fontSize: 30 }}
                              />
                            ) : (
                              <ArrowDownwardIcon
                                sx={{ color: "#c62828", fontSize: 30 }}
                              />
                            )}
                          </Box>

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
                              sx={{
                                fontWeight: "bold",
                                color: "#333",
                                fontSize: "1.2rem",
                              }}
                              noWrap
                              title={entry.title}
                            >
                              {entry.title}
                            </Typography>

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                color:
                                  entry.type === "income"
                                    ? "green"
                                    : "error.main",
                                ml: 2,
                              }}
                            >
                              {entry.type === "income" ? "+" : "-"}₹
                              {entry.amount}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <Chip
                            label={entry.category}
                            size="small"
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              borderRadius: "6px",
                              color:
                                entry.type === "income" ? "#2e7d32" : "#c62828",
                              backgroundColor:
                                entry.type === "income"
                                  ? "rgba(76,175,80,0.15)"
                                  : "rgba(244,67,54,0.15)",
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, color: "#777" }}
                        >
                          {entry.notes || ""}
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
                                onClick={() => handleEdit(entry)}
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

      {/* Add/Edit Entry Modal */}
      <AddEntryModal
        open={openModal}
        handleClose={() => {
          setOpenModal(false);
          setEditingEntry(null);
        }}
        onAdded={() => {
          fetchEntries();
          toast.success(editingEntry ? "Entry updated!" : "Entry added!");
        }}
        editingEntry={editingEntry}
      />
    </Box>
  );
}
