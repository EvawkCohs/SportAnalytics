import React from "react";
import { useTheme, Typography, Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data, opponents }) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 6"
      gridRow="span 4"
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
        Tore pro Spiel
      </Typography>
      <ResponsiveLine
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
                fontSize: 16,
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

          tooltip: {
            container: {
              color: theme.palette.primary[700],
            },
          },
        }}
        margin={{ top: 50, right: 80, bottom: 100, left: 80 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        enableArea={true}
        enableGridX={false}
        enableGridY={false}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 10,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Gegner",
          legendOffset: 45,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tore",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        tooltip={({ point }) => {
          const tooltipText = opponents[point.data.x - 1];
          return (
            <div
              style={{
                padding: "5px",
                background: theme.palette.primary[600],
                color: theme.palette.secondary[200],
                borderRadius: "3px",
              }}
            >
              <strong>{tooltipText} </strong>
              <br />
              Tore: {point.data.y}
            </div>
          );
        }}
      />
    </Box>
  );
};
export default LineChart;
