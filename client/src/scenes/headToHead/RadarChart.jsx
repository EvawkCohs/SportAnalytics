import React from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { useTheme } from "@mui/material";

export const H2HRadarChart = ({ data }) => {
  const theme = useTheme();
  // Ensure fallback to string color if palette value is undefined or not a string
  const red400 = typeof theme.palette.red[400] === "string" ? theme.palette.red[400] : "#ff1744";
  const primary600 = typeof theme.palette.primary[600] === "string" ? theme.palette.primary[600] : "#1a237e";
  const secondary200 = typeof theme.palette.secondary[200] === "string" ? theme.palette.secondary[200] : "#eeeeee";
  const grey700 = typeof theme.palette.grey[700] === "string" ? theme.palette.grey[700] : "#616161";

  return (
    <ResponsiveRadar
      data={data || []}
      keys={["Team"]}
      indexBy="stat"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={red400}
      gridLabelOffset={36}
      gridShape="linear"
      dotSize={10}
      dotColor={red400}
      dotBorderWidth={2}
      colors={[red400]} 
      blendMode="multiply"
      maxValue={40}
      theme={{
        grid: {
          line: {
            stroke: primary600,
          },
        },
        text: { fill: secondary200 },
        tooltip: {
          container: {
            background: grey700,
            color: secondary200,
          },
        },
      }}
    />
  );
};
