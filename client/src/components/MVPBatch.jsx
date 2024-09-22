import React from "react";
import { Typography } from "@mui/material";
import { useTheme, Box } from "@mui/material";

const MVPBatch = () => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius="0.25rem"
      height="32px"
      width="50px"
      border={`1px solid ${theme.palette.secondary[500]}`}
      boxShadow={`0 0 4px ${theme.palette.secondary[500]}`}
    >
      <Typography
        variant="h4"
        sx={{ color: theme.palette.secondary[500] }}
        fontWeight="bold"
      >
        MVP
      </Typography>
    </Box>
  );
};

export default MVPBatch;
