import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography, Tooltip, Fab } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import SummaryCard from "./SummaryCard";
import EntryListCard from "./EntryListCard";
import AddEntryModal from "../Entries/AddEntryModal";

export default function HomePage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const incomes = entries.filter((e) => e.type === "income");
  const expenses = entries.filter((e) => e.type === "expense");

  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const latestIncome = incomes
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  const latestExpense = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pb: 8,
      }}
    >
      <Container sx={{ flexGrow: 1, mt: 4 }}>
        {/* Summary Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 5 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              icon={<AttachMoneyIcon sx={{ color: "#fff" }} />}
              title="Total Income"
              value={`₹${totalIncome}`}
              bg="linear-gradient(135deg,#1976d2,#42a5f5)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              icon={<AccountBalanceWalletIcon sx={{ color: "#fff" }} />}
              title="Total Expenses"
              value={`₹${totalExpense}`}
              bg="linear-gradient(135deg,#e53935,#ef5350)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard
              icon={<AccountBalanceIcon sx={{ color: "#fff" }} />}
              title="Available Balance"
              value={`₹${balance}`}
              bg="linear-gradient(135deg,#43a047,#66bb6a)"
            />
          </Grid>
        </Grid>

        {/* Reports Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 3,
              display: "inline-block",
              borderBottom: "3px solid #1976d2",
              pb: 0.5,
            }}
          >
            Reports
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <EntryListCard
                title="Expenses"
                entries={latestExpense}
                type="expense"
                onViewAll={() => navigate("/view-all-entries")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <EntryListCard
                title="Income"
                entries={latestIncome}
                type="income"
                onViewAll={() => navigate("/view-all-entries")}
              />
            </Grid>
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
              width: 65,
              height: 65,
              boxShadow: "0 6px 24px rgba(25,118,210,0.4)",
            }}
          >
            <AddIcon sx={{ fontSize: 34, color: "white" }} />
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