import React from "react";
import { Switch, Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
export const CustomSwitch = ({ checked, onChange }) => {
  const isNonMedium = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="center">
      <Switch
        defaultChecked={true}
        checked={checked}
        onChange={onChange}
        size={isNonMedium ? "small" : "medium"}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: theme.palette.secondary[400],
            "&:hover": {
              backgroundColor: alpha(theme.palette.secondary[400], 0.1),
            },
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: theme.palette.secondary[400],
          },
          "&.Mui-disabled .MuiSwitch-thumb": {
            color: theme.palette.secondary[500],
          },
        }}
      />
    </Box>
  );
};
