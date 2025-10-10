import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function EntryListCard({
  title,
  entries = [],
  type = "expense",
  onViewAll,
}) {
  const isIncome = type === "income";
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const visibleEntries = entries.slice(0, 5);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 0,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "visible",
        background: isIncome
          ? "linear-gradient(180deg, #f1fbf5 0%, #ffffff 100%)"
          : "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
        display: "flex",
        flexDirection: "column",
        // height: "100%",
        minHeight: 400,
        width: isSmall ? "100%" : "560px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isIncome
                ? "rgba(76,175,80,0.12)"
                : "rgba(244,67,54,0.12)",
            }}
          >
            {isIncome ? (
              <ArrowUpwardIcon sx={{ color: "#2e7d32" }} />
            ) : (
              <ArrowDownwardIcon sx={{ color: "#c62828" }} />
            )}
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, fontSize: "1.3rem" }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ fontSize: "0.95rem" }}
            >
              {isIncome ? "Amount earned recently" : "Amount spent recently"}
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: isIncome ? "green" : "error.main",
            fontSize: "1.4rem",
          }}
        >
          ₹{entries.reduce((sum, e) => sum + Number(e.amount || 0), 0)}
        </Typography>
      </Box>

      <Divider />

      {/* Entry List */}
      <List disablePadding sx={{ flexGrow: 1 }}>
        {visibleEntries.length === 0 ? (
          <ListItem>
            <ListItemText primary="No recent entries" />
          </ListItem>
        ) : (
          visibleEntries.map((e) => (
            <ListItem
              key={e._id}
              sx={{
                py: 1.5,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" flexDirection="column" width="100%">
                {/* Title + Amount */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  {/* Title + Icon */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <AttachMoneyIcon
                      sx={{
                        color: isIncome ? "green" : "error.main",
                        fontSize: "1.2rem",
                      }}
                    />
                    <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                      {e.title}
                    </Typography>
                  </Box>

                  {/* Amount */}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: isIncome ? "green" : "error.main",
                    }}
                  >
                    ₹{e.amount}
                  </Typography>
                </Box>

                {/* Category + Date */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mt={0.5}
                >
                  <Chip
                    label={e.category}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRadius: "6px",
                      color: isIncome ? "#2e7d32" : "#c62828",
                      backgroundColor: isIncome
                        ? "rgba(76,175,80,0.15)"
                        : "rgba(244,67,54,0.15)",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {new Date(e.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))
        )}
      </List>

      {/* View All */}
      {entries.length > 5 && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={onViewAll}
            sx={{
              textTransform: "none",
              background: isIncome ? "#43a047" : "#e53935",
              "&:hover": {
                background: isIncome ? "#388e3c" : "#d32f2f",
              },
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            View All
          </Button>
        </Box>
      )}
    </Paper>
  );
}
