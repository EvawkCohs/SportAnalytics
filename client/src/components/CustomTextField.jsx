import React from "react";
import { TextField, useTheme } from "@mui/material";

export const CustomTextField = ({
  name,
  label,
  value,
  onChange,
  required,
  type,
}) => {
  const theme = useTheme();
  return (
    <TextField
      name={name}
      label={label}
      required={required}
      value={value}
      variant="outlined"
      onChange={onChange}
      type={type}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.grey[400],
          },
          "&:hover fieldset": {
            borderColor: theme.palette.secondary[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary[300],
          },
        },
        "& .MuiInputLabel-root": {
          color: theme.palette.grey[400],
        },
        "&:hover .MuiInputLabel-root": {
          color: theme.palette.secondary[200],
        },
        "& .Mui-focused .MuiInputLabel-root": {
          color: theme.palette.secondary[200],
        },
      }}
    ></TextField>
  );
};
