import React from "react";

export const formatGameDataBar = ({ data }) => {
  const eventsData = data.events;

  // Events nach Toren filtern und in 10 Min Sequenzen teilen
  const teamGoalDataBar = [
    {
      Mannschaft: data.summary.homeTeam.name,
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
      Mannschaft: data.summary.awayTeam.name,
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
  for (const element of eventsData) {
    if (element.type === "Goal" || element.type === "SevenMeterGoal") {
      const timeParts = element.time.split(":");
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);

      if (minutes >= 0 && minutes < 10) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["0 - 10min"] += 1;
        } else {
          teamGoalDataBar[1]["0 - 10min"] += 1;
        }
      } else if (minutes >= 10 && minutes < 20) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["11 - 20min"] += 1;
        } else {
          teamGoalDataBar[1]["11 - 20min"] += 1;
        }
      } else if (
        minutes >= 20 &&
        (minutes < 30 || (minutes === 30 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["21 - 30min"] += 1;
        } else {
          teamGoalDataBar[1]["21 - 30min"] += 1;
        }
      } else if (
        minutes >= 30 &&
        (minutes < 40 || (minutes === 40 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["31 - 40min"] += 1;
        } else {
          teamGoalDataBar[1]["31 - 40min"] += 1;
        }
      } else if (
        minutes >= 40 &&
        (minutes < 50 || (minutes === 50 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["41 - 50min"] += 1;
        } else {
          teamGoalDataBar[1]["41 - 50min"] += 1;
        }
      } else if (
        minutes >= 50 &&
        (minutes < 60 || (minutes === 60 && seconds === 0))
      ) {
        if (element.team === "Home") {
          teamGoalDataBar[0]["51 - 60min"] += 1;
        } else {
          teamGoalDataBar[1]["51 - 60min"] += 1;
        }
      }
    }
  }
  return teamGoalDataBar;
};

export const formatGameDataLine = ({ data }) => {
  const eventsData = data.events;
  const teamGoalDataLine = [
    {
      id: data.summary.homeTeam.name,
      color: "hsl(55, 70%, 50%)",
      data: [],
    },
    {
      id: data.summary.awayTeam.name,
      color: "hsl(273, 70%, 50%)",
      data: [],
    },
  ];

  for (const element of eventsData.slice().reverse()) {
    if (element.type === "Goal" || element.type === "SevenMeterGoal") {
      const timeParts = element.time.split(":");
      const minutes = parseInt(timeParts[0], 10);
      const seconds = parseInt(timeParts[1], 10);
      const timeForAxis = minutes + seconds / 60;

      const goalParts = element.score.split("-");
      let point1 = { x: timeForAxis.toFixed(2), y: parseInt(goalParts[0]) };
      teamGoalDataLine[0].data.push(point1);
      let point2 = { x: timeForAxis.toFixed(2), y: parseInt(goalParts[1]) };
      teamGoalDataLine[1].data.push(point2);
    }
  }

  return teamGoalDataLine;
};
