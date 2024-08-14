import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

const TeamGoalChart = ({ data }) => {
  const theme = useTheme();
  return (
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
            color: theme.palette.primary.main,
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
      colors={{ scheme: "yellow_orange_red" }}
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
  );
};
export default TeamGoalChart;
