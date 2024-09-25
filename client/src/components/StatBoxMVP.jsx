import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const StatBoxMVP = ({
  nameMVP,
  goalsMVP,
  penaltyMVP,
  teamMVP,
  name2nd,
  goals2nd,
  penalty2nd,
  team2nd,
  name3rd,
  goals3rd,
  penalty3rd,
  team3rd,
}) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="1/3"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      className="data-display"
    >
      <Typography
        variant="h2"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        Wertvollste Spieler
      </Typography>
      <Typography
        variant="h5"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {nameMVP} {goalsMVP} Tore davon {penaltyMVP} Siebenmeter ({teamMVP})
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {name2nd} {goals2nd} Tore davon {penalty2nd} Siebenmeter ({team2nd})
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.secondary[100] }}
        textAlign="center"
      >
        {name3rd} {goals3rd} Tore davon {penalty3rd} Siebenmeter ({team3rd})
      </Typography>
    </Box>
  );
};

export default StatBoxMVP;
