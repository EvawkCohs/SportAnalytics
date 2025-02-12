import React from "react";
import { Select, useTheme } from "@mui/material";

export const CustomSelect = ({ value, label, onChange, labelId, children }) => {
  const theme = useTheme();
  return (
    <Select
      variant="outlined"
      value={value}
      label={label}
      labelId={labelId}
      onChange={onChange}
      sx={{
        "& .MuiSelect-select": {
          color: theme.palette.secondary[200],
        },
        "& .MuiSelect-select.MuiSelect-select": {
          color: theme.palette.secondary[200],
        },
        "&MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.secondary[200],
          },
          "&:hover fieldset": {
            borderColor: theme.palette.secondary[500],
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary[500],
          },
        },
      }}
    >
      {children}
    </Select>
  );
};
