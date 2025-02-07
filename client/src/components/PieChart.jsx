import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { useTheme, Box, Typography , useMediaQuery} from "@mui/material";

const PieChart = ({ data, title }) => {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  return (
    <Box
      gridColumn="span 2"
      gridRow="span 2"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        p: {
          xs: "0.25rem 0.25rem",
          sm: "0.5rem 0.25rem",
          md: "0.75rem 0.5rem",
          lg: "1rem 0.75rem",
          xl: "1.25rem 1rem",
        },
        m: {
          xs: "0.125rem 0.0625rem",
          sm: "0.125rem",
          md: "0.25rem",
          lg: "0.5rem",
          xl: "0.5rem",
        },
      }}
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      className="data-display"
      border="1px solid #2f2b38"
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
        margin={isNonMediumScreen ?{ top: 15, right: 80, bottom: 80, left: 80 } : {top: 10, right: 50, bottom: 60,left:50}}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={[
          theme.palette.secondary[500],
          theme.palette.secondary[200],
          theme.palette.secondary[700],
        ]}
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
            translateY: 25,
            itemsSpacing: 50,
            itemWidth: 50,
            itemHeight: 18,
            itemTextColor: theme.palette.secondary[200],
            itemDirection: "top-to-bottom",
            itemOpacity: 1,
            symbolSize: isNonMediumScreen ? 18 : 12,
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
