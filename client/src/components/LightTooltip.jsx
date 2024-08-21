import React from "react";
import { styled } from "@mui/material/styles";
import { Tooltip, tooltipClasses, useTheme } from "@mui/material";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.secondary[200],
    color: theme.palette.background.alt,
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default LightTooltip;
