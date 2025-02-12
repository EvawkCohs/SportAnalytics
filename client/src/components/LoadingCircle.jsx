import React from "react";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";

export const LoadingCircle = () => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={"column"}
      mt="40vh"
    >
      <CircularProgress
        variant="indeterminate"
        thickness={1}
        size={120}
        sx={{
          color: theme.palette.secondary.main,
          position: "absolute",
          zIndex: 2,
        }}
      />
      <Typography variant="h6" sx={{ color: theme.palette.secondary[200] }}>
        Loading...
      </Typography>
    </Box>
  );
};
