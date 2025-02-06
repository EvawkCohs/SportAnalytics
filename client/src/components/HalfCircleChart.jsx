import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
const HalfCircleChart = ({ value, compareValue, mode }) => {
  const theme = useTheme();
  const rawDiff = ((value / compareValue) * 100) / 4 - 25;
  const adjustedDiff = Math.sign(rawDiff) * Math.pow(Math.abs(rawDiff), 4) + 25;
  const isNonMedium = useMediaQuery("(min-width: 900px");

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
      sx={{
        width: {
          xs: "100px",
          sm: "100px",
          md: "200px",
          lg: "200px",
          xl: "200px",
        },
        height: {
          xs: "50px",
          sm: "50px",
          md: "100px",
          lg: "100px",
          xl: "100px",
        },
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        thickness={1}
        size={isNonMedium ? 200 : 100}
        sx={{
          color: theme.palette.grey[600],
          position: "absolute",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          transform: "rotate(270deg)",
          transformOrigin: "bottom",
          position: "relative",
          zIndex: 2,
          width: {
            xs: "100px",
            sm: "100px",
            md: "200px",
            lg: "200px",
            xl: "200px",
          },
          height: {
            xs: "50px",
            sm: "50px",
            md: "100px",
            lg: "100px",
            xl: "100px",
          },
        }}
      >
        <CircularProgress
          variant="determinate"
          value={adjustedDiff}
          thickness={1}
          size={isNonMedium ? 200 : 100}
          sx={{
            color: theme.palette.secondary.main,
            position: "absolute",
            zIndex: 2,
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "5%",
          color:
            (adjustedDiff > 25 && mode === "high") ||
            (adjustedDiff < 25 && mode === "low")
              ? theme.palette.green[100]
              : (adjustedDiff < 25 && mode === "high") ||
                (adjustedDiff > 25 && mode === "low")
              ? theme.palette.red[500]
              : theme.palette.secondary[100],
          fontWeight: "bold",
          mt: {
            xs: "0.5rem",
            sm: "0.5rem",
            md: "0.75rem",
            lg: "1rem",
            xl: "1rem",
          },
        }}
      >
        {adjustedDiff > 25
          ? `+ ${(value - compareValue).toFixed(2)}`
          : ` ${(value - compareValue).toFixed(2)}`}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "40%",
          color: theme.palette.secondary[100],
          textAlign: "center",
          mt: {
            xs: "0",
            sm: "0rem",
            md: "0.25rem",
            lg: "0.5rem",
            xl: "0.5rem",
          },
        }}
      >
        {adjustedDiff > 25 && mode === "high" ? (
          <TrendingUpIcon sx={{ color: theme.palette.green[100] }} />
        ) : adjustedDiff < 25 && mode === "high" ? (
          <TrendingDownIcon sx={{ color: theme.palette.red[500] }} />
        ) : adjustedDiff < 25 && mode === "low" ? (
          <TrendingDownIcon sx={{ color: theme.palette.green[100] }} />
        ) : adjustedDiff > 25 && mode === "low" ? (
          <TrendingUpIcon sx={{ color: theme.palette.red[500] }} />
        ) : (
          <></>
        )}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "70%",
          color:
            adjustedDiff > 25 && mode === "high"
              ? theme.palette.green[100]
              : adjustedDiff < 25 && mode === "high"
              ? theme.palette.red[500]
              : adjustedDiff > 25 && mode === "low"
              ? theme.palette.red[500]
              : adjustedDiff < 25 && mode === "low"
              ? theme.palette.green[100]
              : theme.palette.secondary[100],
          fontWeight: "bold",
          mt: {
            xs: "0.25rem",
            sm: "0.3rem",
            md: "0",
            lg: "0",
            xl: "0.5rem",
          },
        }}
      >
        {(adjustedDiff > 25 && mode === "high") ||
        (adjustedDiff < 25 && mode === "low")
          ? "verbessert"
          : (adjustedDiff > 29 && mode === "high") ||
            (adjustedDiff < 21 && mode === "low")
          ? "deutlich verbessert"
          : (adjustedDiff < 25 && mode === "high") ||
            (adjustedDiff > 25 && mode === "low")
          ? "verschlechtert"
          : "durchschnittlich"}
      </Typography>
    </Box>
  );
};
export default HalfCircleChart;
