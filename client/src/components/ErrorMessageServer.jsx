import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";

export const ErrorMessageServer = () => {
  const theme = useTheme();

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      mt="40vh"
      flexDirection={"column"}
    >
      <DnsOutlinedIcon
        sx={{ color: theme.palette.red[500] }}
        fontSize="large"
      />
      <Typography variant="h6" sx={{ color: theme.palette.red[500] }}>
        Server aktuell nicht erreichbar
      </Typography>
    </Box>
  );
};
