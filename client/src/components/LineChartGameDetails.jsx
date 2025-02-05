import React from "react";
import { useTheme, Typography, Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
      className="data-display"
      border="1px solid #2f2b38"
      sx={{
        gridColumn: {
          xs: "1",
          sm: "1/3",
          md: "1/5",
          lg: "1/5",
          xl: "1/5",
        },
        gridRow: {
          xs: "4/6",
          sm: "3/5",
          md: "3/5",
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
    >
      <Typography
        variant="h3"
        sx={{ color: theme.palette.secondary[200] }}
        textAlign="center"
      >
        Torverlauf
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
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "linear", min: 0, max: 60 }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.1~f"
        xFormat=" >-.1~d"
        colors={[theme.palette.secondary[600], theme.palette.secondary[200]]}
        curve="linear"
        enableArea={true}
        axisTop={null}
        enableGridX={false}
        enableGridY={false}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Minuten",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
          tickValues: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tore",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        pointSize={3}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => {
          return (
            <div
              style={{
                padding: "5px",
                background: theme.palette.primary[600],
                color: theme.palette.secondary[200],
                borderRadius: "3px",
              }}
            >
              <strong>{point.id.slice(0, -3)}</strong>
              <br />
              {point.data.xFormatted}. min <br />
              {point.data.y} Tore
            </div>
          );
        }}
      />
    </Box>
  );
};
export default LineChart;
