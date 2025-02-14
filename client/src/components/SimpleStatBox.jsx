import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Fade } from "@mui/material";
import "index.css";

const SimpleStatBox = ({ value, secondaryValue, title }) => {
  const theme = useTheme();
  const [isChecked, setisChecked] = useState(false);

  useEffect(() => {
    setisChecked(true);
  }, [isChecked]);
  return (
    <Fade in={isChecked} timeout={500}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        backgroundColor={theme.palette.background.alt}
        borderRadius="0.55rem"
        flex="1 1 100%"
        height="100%"
        className="data-display"
        sx={{
          p: {
            xs: "0.25rem 0.125rem", // für sehr kleine Bildschirme
            sm: "0.5rem 0.25rem", // für kleine Bildschirme
            md: "0.75rem 0.5rem", // für mittlere Bildschirme
            lg: "1rem 0.75rem", // für größere Bildschirme
            xl: "1.25rem 1rem",
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.secondary[200],
          }}
          textAlign="center"
        >
          {title}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            color: theme.palette.secondary[200],
          }}
          textAlign="center"
        >
          {value}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.secondary[200],
          }}
          textAlign="center"
        >
          {secondaryValue}
        </Typography>
      </Box>
    </Fade>
  );
};

export default SimpleStatBox;
