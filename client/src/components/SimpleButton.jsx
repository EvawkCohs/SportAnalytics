import React from "react";
import { Button, useTheme } from "@mui/material";

const SimpleButton = ({ text, Icon, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.secondary[300],
        color: theme.palette.background.alt,
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        "&:hover": {
          backgroundColor: theme.palette.grey[600],
        },
        minWidth: "150px",
      }}
      onClick={onClick}
    >
      {Icon && <Icon className="icon" sx={{ mr: "0.5rem" }} />}
      {text}
    </Button>
  );
};
export default SimpleButton;
