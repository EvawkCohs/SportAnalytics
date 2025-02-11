import { Typography, Box, useTheme } from "@mui/material";
import React from "react";
import MVPBatch from "./MVPBatch";

const Header = ({ title, subtitle, mvp }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        gap="1rem"
        alignItems="center"
        flexDirection="row"
      >
        <Typography
          variant="h2"
          color={theme.palette.secondary[100]}
          fontWeight={"bold"}
          sx={{ mb: "1rem", ml: "1rem" }}
        >
          {title}
        </Typography>
        {mvp ? <MVPBatch /> : <Box />}
      </Box>
      <Typography
        variant="h5"
        color={theme.palette.secondary[300]}
        sx={{ ml: "1rem" }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
