import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

const StatBox = ({
  title,
  finalScore,
  homeTeam,
  awayTeam,
  halftimeScore,
  round,
}) => {
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
      <Typography
        variant="h4"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {round}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" p="1.25rem 1rem">
        {/*ROW 1 */}
        <Box gridColumn="span 1" gridRow="span 1" display="flex">
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="300"
            sx={{ color: theme.palette.secondary[100] }}
          >
            {homeTeam}
          </Typography>
        </Box>
        <Box gridColumn="span 1">
          <Typography
            variant="h2"
            fontWeight="600"
            sx={{ color: theme.palette.secondary[200] }}
            textAlign="center"
          >
            {finalScore}
          </Typography>
        </Box>
        <Box gridColumn="span 1" gridRow="span 1" display="flex">
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
          mt="20px"
        >
          <SportsHandballIcon />
        </Box>
        <Typography
          variant="h4"
          fontWeight="400"
          sx={{ color: theme.palette.secondary[200] }}
          textAlign="center"
        >
          {halftimeScore}
        </Typography>
        {/*Später Vereinslog */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="20px"
        >
          <SportsHandballIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
