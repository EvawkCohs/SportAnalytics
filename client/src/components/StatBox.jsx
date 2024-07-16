import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

const StatBox = ({ title, finalScore, homeTeam, awayTeam, halftimeScore }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <Typography
        variant="h3"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {title}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)">
        {/*ROW 1 */}
        <Box
          gridColumn="span 1"
          gridRow="span 1"
          display="flex"
          p="1.25rem 1rem"
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="300"
            sx={{ color: theme.palette.secondary[100] }}
          >
            {homeTeam}
          </Typography>
        </Box>
        <Box gridColumn="span 1" p="1.25rem 1rem">
          <Typography
            variant="h2"
            fontWeight="600"
            sx={{ color: theme.palette.secondary[200] }}
            textAlign="center"
          >
            {finalScore}
          </Typography>
        </Box>
        <Box
          gridColumn="span 1"
          gridRow="span 1"
          display="flex"
          justifyContent="center"
          p="1.25rem 1rem"
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="300"
            sx={{ color: theme.palette.secondary[100] }}
          >
            {awayTeam}
          </Typography>
        </Box>

        {/*ROW 2 */}

        {/*Später Vereinslog */}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p="1.25rem 1rem"
        >
          <SportsHandballIcon />
        </Box>
        <Typography
          variant="h4"
          fontWeight="400"
          sx={{ color: theme.palette.secondary[200] }}
          textAlign="center"
          p="1.25rem 1rem"
        >
          {halftimeScore}
        </Typography>
        {/*Später Vereinslog */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p="1.25rem 1rem"
        >
          <SportsHandballIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
