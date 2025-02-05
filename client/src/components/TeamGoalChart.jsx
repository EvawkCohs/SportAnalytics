import React from "react";
import { Typography, useTheme, Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

const TeamGoalChart = ({ data }) => {
  const theme = useTheme();
  const customColors = [
    theme.palette.secondary[100],
    theme.palette.secondary[200],
    theme.palette.secondary[300],
    theme.palette.secondary[400],
    theme.palette.secondary[500],
    theme.palette.secondary[600],
  ];
  return (
    <Box
      sx={{
        gridColumn: {
          xs: "1",
          sm: "1/3",
          md: "1/5",
          lg: "5/9",
          xl: "5/9",
        },
        gridRow: {
          xs: "6/8",
          sm: "5/7",
          md: "5/7",
          lg: "2/5",
          xl: "2/5",
        },
        p: {
          xs: "1.25rem 0.25rem",
          sm: "1.25rem 0.25rem",
          md: "1.25rem 0.5rem",
          lg: "1.25rem 0.75rem",
          xl: "1.25rem 1rem",
        },
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
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
        Tore pro Abschnitt
      </Typography>
      <ResponsiveBar
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: theme.palette.secondary[200],
              },
            },
            legend: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
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
        keys={[
          "0 - 10min",
          "11 - 20min",
          "21 - 30min",
          "31 - 40min",
          "41 - 50min",
          "51 - 60min",
        ]}
        indexBy="Mannschaft"
        margin={{ top: 50, right: 100, bottom: 50, left: 60 }}
        padding={0.25}
        innerPadding={1}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={customColors}
        borderRadius={3}
        borderColor={{
          from: "color",
          modifiers: [["darker", "2.3"]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Mannschaft",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tore",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableGridY={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="black"
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="TeamGoalChart"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " Tore " + e.indexValue
        }
      />
    </Box>
  );
};
export default TeamGoalChart;
