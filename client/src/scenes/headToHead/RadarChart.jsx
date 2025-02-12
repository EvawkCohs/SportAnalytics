import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useTheme } from "@mui/material";

export const H2HRadarChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveRadar
      data={data || []}
      keys={["Team"]}
      indexBy="stat"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={theme.palette.red[400]}
      gridLabelOffset={36}
      gridShape="linear"
      dotSize={10}
      dotColor={theme.palette.red[400]}
      dotBorderWidth={2}
      colors={theme.palette.red[400]}
      blendMode="multiply"
      maxValue={40}
      theme={{
        grid: {
          line: {
            stroke: theme.palette.primary[600],
          },
        },
        text: { fill: theme.palette.secondary[200] },
        tooltip: {
          container: {
            background: theme.palette.grey[700],
            color: theme.palette.secondary[200],
          },
        },
      }}
    />
  );
};
