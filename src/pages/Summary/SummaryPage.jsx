import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SummaryCard from "../home/SummaryCard";

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);

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
      console.error("Error fetching entries:", err);
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

  const incomeCategories = {};
  incomes.forEach((e) => {
    incomeCategories[e.category] =
      (incomeCategories[e.category] || 0) + Number(e.amount || 0);
  });
  const incomeData = Object.keys(incomeCategories).map((key) => ({
    name: key,
    value: incomeCategories[key],
  }));

  const expenseCategories = {};
  expenses.forEach((e) => {
    expenseCategories[e.category] =
      (expenseCategories[e.category] || 0) + Number(e.amount || 0);
  });
  const expenseData = Object.keys(expenseCategories).map((key) => ({
    name: key,
    value: expenseCategories[key],
  }));

  const COLORS = ["#6a5acd", "#ff6f61", "#42a5f5", "#ffb300", "#66bb6a"];

  const handleSelectExpense = (cat) =>
    setSelectedExpense(selectedExpense === cat ? null : cat);
  const handleSelectIncome = (cat) =>
    setSelectedIncome(selectedIncome === cat ? null : cat);

  const selectedExpenseData =
    selectedExpense && expenseData.find((d) => d.name === selectedExpense);
  const selectedIncomeData =
    selectedIncome && incomeData.find((d) => d.name === selectedIncome);

  const expenseColor = "#e53935";
  const incomeColor = "#43a047";

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 8, maxWidth: "lg !important" }}>
      {/* Summary Cards */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            icon={<ArrowUpwardIcon sx={{ color: "#fff" }} />}
            title="Total Income"
            value={`₹${totalIncome.toLocaleString()}`}
            bg="linear-gradient(135deg,#43a047,#66bb6a)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            icon={<ArrowDownwardIcon sx={{ color: "#fff" }} />}
            title="Total Expenses"
            value={`₹${totalExpense.toLocaleString()}`}
            bg="linear-gradient(135deg,#e53935,#ef5350)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            icon={<AccountBalanceWalletIcon sx={{ color: "#fff" }} />}
            title="Available Balance"
            value={`₹${balance.toLocaleString()}`}
            bg="linear-gradient(135deg,#1976d2,#42a5f5)"
          />
        </Grid>
      </Grid>

      {/* Financial Overview */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 4,
          borderBottom: "3px solid #1976d2",
          display: "inline-block",
          pb: 0.5,
        }}
      >
        Financial Overview
      </Typography>

      <Grid container spacing={6} justifyContent="stretch" alignItems="stretch">
        {/* EXPENSES */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              height: 420,
              transition: "0.3s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(229, 57, 53, 0.12)",
                  }}
                >
                  <ArrowDownwardIcon sx={{ color: expenseColor }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: expenseColor }}
                  >
                    Expenses
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#777",
                      fontWeight: 500,
                      mt: 2,
                    }}
                  >
                    Monthly breakdown
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: expenseColor }}
                >
                  ₹{totalExpense.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 500,
                    mt: 2,
                  }}
                >
                  Total Amount
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 240, position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={expenseData}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        opacity={
                          !selectedExpense || entry.name === selectedExpense
                            ? 1
                            : 0.25
                        }
                        cursor="pointer"
                        onClick={() => handleSelectExpense(entry.name)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: 120,
                }}
              >
                <Typography
                  sx={{ 
                    fontSize: 14, 
                    fontWeight: 700, 
                    color: expenseColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {!selectedExpense ? "Total" : selectedExpense}
                </Typography>
                {!selectedExpense ? (
                  <Typography
                    sx={{ 
                      fontSize: 20, 
                      fontWeight: 700, 
                      color: expenseColor, 
                      mt: 0.5 
                    }}
                  >
                    ₹{totalExpense.toLocaleString()}
                  </Typography>
                ) : selectedExpenseData ? (
                  <>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        color: expenseColor, 
                        mt: 0.5,
                        fontWeight: 600
                      }}
                    >
                      {(
                        (selectedExpenseData.value / totalExpense) *
                        100
                      ).toFixed(0)}
                      %
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        color: "#444", 
                        mt: 0.5,
                        fontWeight: 600
                      }}
                    >
                      ₹{selectedExpenseData.value.toLocaleString()}
                    </Typography>
                  </>
                ) : null}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
              {expenseData.map((d, i) => (
                <Box
                  key={i}
                  onClick={() => handleSelectExpense(d.name)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor:
                      selectedExpense === d.name
                        ? `${COLORS[i % COLORS.length]}40`
                        : `${COLORS[i % COLORS.length]}15`,
                    color: COLORS[i % COLORS.length],
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: `${COLORS[i % COLORS.length]}30`,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {d.name}
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedExpense(null)}
              sx={{
                mt: 3,
                textTransform: "none",
                backgroundColor: expenseColor,
                color: "white",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              All Expenses
            </Button>
          </Box>
        </Grid>

        {/* INCOME */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              height: 420,
              transition: "0.3s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(67, 160, 71, 0.12)",
                  }}
                >
                  <ArrowUpwardIcon sx={{ color: incomeColor }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: incomeColor }}
                  >
                    Income
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#777",
                      fontWeight: 500,
                      mt: 2,
                    }}
                  >
                    Monthly breakdown
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: incomeColor }}
                >
                  ₹{totalIncome.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 500,
                    mt: 2,
                  }}
                >
                  Total Amount
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: 240, position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={incomeData}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        opacity={
                          !selectedIncome || entry.name === selectedIncome
                            ? 1
                            : 0.25
                        }
                        cursor="pointer"
                        onClick={() => handleSelectIncome(entry.name)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: 120,
                }}
              >
                <Typography
                  sx={{ 
                    fontSize: 14, 
                    fontWeight: 700, 
                    color: incomeColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {!selectedIncome ? "Total" : selectedIncome}
                </Typography>
                {!selectedIncome ? (
                  <Typography
                    sx={{ 
                      fontSize: 20, 
                      fontWeight: 700, 
                      color: incomeColor, 
                      mt: 0.5 
                    }}
                  >
                    ₹{totalIncome.toLocaleString()}
                  </Typography>
                ) : selectedIncomeData ? (
                  <>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        color: incomeColor, 
                        mt: 0.5,
                        fontWeight: 600
                      }}
                    >
                      {(
                        (selectedIncomeData.value / totalIncome) *
                        100
                      ).toFixed(0)}
                      %
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        color: "#444", 
                        mt: 0.5,
                        fontWeight: 600
                      }}
                    >
                      ₹{selectedIncomeData.value.toLocaleString()}
                    </Typography>
                  </>
                ) : null}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
              {incomeData.map((d, i) => (
                <Box
                  key={i}
                  onClick={() => handleSelectIncome(d.name)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor:
                      selectedIncome === d.name
                        ? `${COLORS[i % COLORS.length]}40`
                        : `${COLORS[i % COLORS.length]}15`,
                    color: COLORS[i % COLORS.length],
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: `${COLORS[i % COLORS.length]}30`,
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {d.name}
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setSelectedIncome(null)}
              sx={{
                mt: 3,
                textTransform: "none",
                backgroundColor: incomeColor,
                color: "white",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              All Income
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}