import React from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

const TeamGoalChart = ({ data }) => {
  const theme = useTheme();
  const eventsData = data.data.events;
  const teamGoalData = [
    {
      Mannschaft: "",
      "0 - 10min": 0,
      "0 - 10minColor": "hsl(62, 70%, 50%)",
      "11 - 20min": 0,
      "11 - 20minColor": "hsl(281, 70%, 50%)",
      "21 - 30min": 0,
      "21 - 30minColor": "hsl(302, 70%, 50%)",
      "31 - 40min": 0,
      "31 - 40minColor": "hsl(355, 70%, 50%)",
      "41 - 50min": 0,
      "41 - 50minColor": "hsl(39, 70%, 50%)",
      "51 - 60min": 0,
      "51 - 60minColor": "hsl(204, 70%, 50%)",
    },
    {
      Mannschaft: "",
      "0 - 10min": 0,
      "0 - 10minColor": "hsl(62, 70%, 50%)",
      "11 - 20min": 0,
      "11 - 20minColor": "hsl(281, 70%, 50%)",
      "21 - 30min": 0,
      "21 - 30minColor": "hsl(302, 70%, 50%)",
      "31 - 40min": 0,
      "31 - 40minColor": "hsl(355, 70%, 50%)",
      "41 - 50min": 0,
      "41 - 50minColor": "hsl(39, 70%, 50%)",
      "51 - 60min": 0,
      "51 - 60minColor": "hsl(204, 70%, 50%)",
    },
  ];
  teamGoalData[0]["Mannschaft"] = data.data.summary.homeTeam.name;
  teamGoalData[1]["Mannschaft"] = data.data.summary.awayTeam.name;
  for (const element of eventsData) {
    if (element.type === "Goal" || element.type === "SevenMeterGoal") {
      const timeParts = element.time.split(":");
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);

      if (minutes >= 0 && minutes < 10) {
        if (element.team === "Home") {
          teamGoalData[0]["0 - 10min"] += 1;
        } else {
          teamGoalData[1]["0 - 10min"] += 1;
        }
      } else if (minutes >= 10 && minutes < 20) {
        if (element.team === "Home") {
          teamGoalData[0]["11 - 20min"] += 1;
        } else {
          teamGoalData[1]["11 - 20min"] += 1;
        }
      } else if (
        minutes >= 20 &&
        (minutes < 30 || (minutes === 30 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalData[0]["21 - 30min"] += 1;
        } else {
          teamGoalData[1]["21 - 30min"] += 1;
        }
      } else if (
        minutes >= 30 &&
        (minutes < 40 || (minutes === 40 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalData[0]["31 - 40min"] += 1;
        } else {
          teamGoalData[1]["31 - 40min"] += 1;
        }
      } else if (
        minutes >= 40 &&
        (minutes < 50 || (minutes === 50 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalData[0]["41 - 50min"] += 1;
        } else {
          teamGoalData[1]["41 - 50min"] += 1;
        }
      } else if (
        minutes >= 50 &&
        (minutes < 60 || (minutes === 60 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalData[0]["51 - 60min"] += 1;
        } else {
          teamGoalData[1]["51 - 60min"] += 1;
        }
      }
    }
  }

  return (
    <ResponsiveBar
      data={teamGoalData}
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
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Tore",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      enableGridY={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="black"
      legends={[]}
      role="application"
      ariaLabel="TeamGoalChart"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in Mannschaft: " + e.indexValue
      }
    />
  );
};
export default TeamGoalChart;
