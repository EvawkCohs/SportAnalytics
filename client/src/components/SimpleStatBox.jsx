import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Fade } from "@mui/material";
import "index.css";

const SimpleStatBox = ({ value, secondaryValue, title, icon }) => {
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
        p="1.25rem 1rem"
        backgroundColor={theme.palette.primary[700]}
        borderRadius="0.55rem"
        flex="1 1 100%"
        height="100%"
        className="data-display"
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.secondary[200],
            fontSize: {
              xs: "0.5rem", // für sehr kleine Bildschirme
              sm: "0.5rem", // für kleine Bildschirme
              md: "1rem", // für mittlere Bildschirme
              lg: "1.5rem", // für größere Bildschirme
              xl: "2rem",
            },
          }}
          textAlign="center"
        >
          {title}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.secondary[200],
            fontSize: {
              xs: "0.5rem", // für sehr kleine Bildschirme
              sm: "0.5rem", // für kleine Bildschirme
              md: "1rem", // für mittlere Bildschirme
              lg: "1.5rem", // für größere Bildschirme
              xl: "2rem",
            },
          }}
          textAlign="center"
        >
          {value}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.secondary[200],
            fontSize: {
              xs: "0.25rem", // für sehr kleine Bildschirme
              sm: "0.5rem", // für kleine Bildschirme
              md: "0.75rem", // für mittlere Bildschirme
              lg: "1rem", // für größere Bildschirme
              xl: "1.25rem",
            },
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
