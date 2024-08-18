import React from "react";
import { Button, useTheme } from "@mui/material";

const SimpleButton = ({ text, Icon, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.background.alt,
        fontSize: "14px",
        fontWeight: "bold",
      }}
      onClick={onClick}
    >
      {Icon && <Icon className="icon" sx={{ mr: "0.5rem" }} />}
      {text}
    </Button>
  );
};
export default SimpleButton;
