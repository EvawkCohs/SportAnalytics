import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme, Box, Typography } from "@mui/material";

const PieChart = ({ data, title }) => {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Box
      gridColumn="span 2"
      gridRow="5 /7 "
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
        variant="h3"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        {title}
      </Typography>
      <ResponsivePie
        data={data}
        theme={{
          legends: {
            text: {
              fill: theme.palette.secondary[200],
            },
          },
          tooltip: {
            container: {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.primary[700],
            },
          },
        }}
        margin={{ top: 5, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={[theme.palette.secondary[600], theme.palette.secondary[200]]}
        borderWidth={0}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="black"
        arcLabel={false}
        legends={[
          {
            display: "flex",
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 20,
            itemsSpacing: 100,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: theme.palette.secondary[200],
            itemDirection: "top-to-bottom",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",

            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[200],
                },
              },
            ],
          },
        ]}
        layers={[
          "slices", // Behalte die Standard-Layers
          "sliceLabels",
          "radialLabels",
          "legends",
          "arcs",
          "arcLinkLabels",
          "arcLabels",
          ({ centerX, centerY }) => (
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: "28px",
                fontWeight: "600",
                fill: theme.palette.secondary[200],
              }}
            >
              {total}
            </text>
          ),
        ]}
      />
    </Box>
  );
};
export default PieChart;
