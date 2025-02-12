import React from "react";
import { InputLabel, useTheme } from "@mui/material";

export const CustomInputLabel = ({ children, id }) => {
  const theme = useTheme();
  return (
    <InputLabel
      label={id}
      sx={{
        color: theme.palette.secondary[200],
        "&.Mui-focused": {
          color: theme.palette.secondary[300],
        },
      }}
    >
      {children}
    </InputLabel>
  );
};
