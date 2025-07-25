import React from "react";
import { Button, useTheme } from "@mui/material";

const SimpleButton = ({ text, Icon, onClick, disabled }) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.secondary[300],
        color: theme.palette.background.alt,
        fontSize: { xs: "6px", sm: "8px", md: "10px", lg: "12px", xl: "14px" },
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        "&:hover": {
          backgroundColor: theme.palette.grey[500],
        },
        '&.Mui-disabled':{
          backgroundColor: theme.palette.grey[500],
          color: theme.palette.red[500]
        },
        minWidth: "50px",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="icon" sx={{ mr: "0.5rem" }} />}
      {text}
    </Button>
  );
};
export default SimpleButton;
