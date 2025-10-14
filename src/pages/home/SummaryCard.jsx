import React from "react";
import { Paper, Box, Typography, useTheme, useMediaQuery } from "@mui/material";

export default function SummaryCard({ icon, title, value, bg }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={2}
      sx={{
        p: isSmall ? 2 : 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        height: "130px",
        width: "320px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500, mb: 0.5 , fontSize: "0.95rem"}}
        >
          {title.toUpperCase()}
        </Typography>
        <Typography
          variant={isSmall ? "h6" : "h5"}
          sx={{ fontWeight: 700, letterSpacing: 0.5 }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}