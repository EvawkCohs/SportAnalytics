import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const StatBoxGameAttendance = ({ attendance, fieldName }) => {
  const theme = useTheme();

  return (
    <Box
      gridColumn="7/10"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        Zuschauer
      </Typography>
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {attendance}
      </Typography>
      <Typography
        variant="h4"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {fieldName}
      </Typography>
    </Box>
  );
};

export default StatBoxGameAttendance;
