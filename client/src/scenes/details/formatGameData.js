export const FormatGameDataBar = ({ data }) => {
  const eventsData = data.events;

  // Events nach Toren filtern und in 10 Min Sequenzen teilen
  const teamGoalDataBar = [
    {
      Mannschaft: data.summary.homeTeam.name,
      "0 - 10min": 0,
      "11 - 20min": 0,
      "21 - 30min": 0,
      "31 - 40min": 0,
      "41 - 50min": 0,
      "51 - 60min": 0,
    },
    {
      Mannschaft: data.summary.awayTeam.name,
      "0 - 10min": 0,
      "11 - 20min": 0,
      "21 - 30min": 0,
      "31 - 40min": 0,
      "41 - 50min": 0,
      "51 - 60min": 0,
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

export const FormatGameDataLine = ({ data }) => {
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

export const FormatSpecificEventData = ({ data }, type) => {
  const suspensionData = [
    {
      id: data.summary.homeTeam.name,
      label: data.summary.homeTeam.name,
      value: 0,
      color: "hsl(219, 70%, 50%)",
    },
    {
      id: data.summary.awayTeam.name,
      label: data.summary.awayTeam.name,
      value: 0,
      color: "hsl(282, 70%, 50%)",
    },
  ];

  for (const element of data.events) {
    if (element.type === type && element.team === "Home") {
      suspensionData[0].value += 1;
    } else if (element.type === type && element.team === "Away") {
      suspensionData[1].value += 1;
    }
  }
  return suspensionData;
};
export const FormatSpecificEventDataCustomEvents = (
  data,
  type,
  homeTeam,
  awayTeam
) => {
  const suspensionData = [
    {
      id: homeTeam,
      label: homeTeam,
      value: 0,
      color: "hsl(219, 70%, 50%)",
    },
    {
      id: awayTeam,
      label: awayTeam,
      value: 0,
      color: "hsl(282, 70%, 50%)",
    },
  ];
  for (const element of data) {
    if (element.type === type && element.team === "Home") {
      suspensionData[0].value += 1;
    } else if (element.type === type && element.team === "Away") {
      suspensionData[1].value += 1;
    }
  }

  return suspensionData;
};

export const FormatTableData = ({ data }) => {
  const tableDataHome = data.lineup.home;
  const tableDataAway = data.lineup.away;
  const updatedTableDataHome = tableDataHome.map((obj) => ({
    ...obj,
    team: data.summary.homeTeam.name,
    acronym: data.summary.homeTeam.acronym,
  }));
  const updatedTableDataAway = tableDataAway.map((obj) => ({
    ...obj,
    team: data.summary.awayTeam.name,
    acronym: data.summary.awayTeam.acronym,
  }));

  const tableData = updatedTableDataHome.concat(updatedTableDataAway);
  return tableData;
};

export const FormatSpecificGoalDataHome = ({ data }) => {
  const homeLineup = data.lineup.home;

  const wingPlayers = homeLineup.filter(
    (player) => player.position === "RA" || player.position === "LA"
  );
  const pivotPlayers = homeLineup.filter((player) => player.position === "KM");
  const backPlayers = homeLineup.filter(
    (player) =>
      player.position === "RL" ||
      player.position === "RM" ||
      player.position === "RR" ||
      player.position === "TW"
  );

  const sumGoals = (players) =>
    players.reduce((total, player) => total + player.goals, 0);

  let wingGoals = sumGoals(wingPlayers);
  let pivotGoals = sumGoals(pivotPlayers);
  let backGoals = sumGoals(backPlayers);
  const goalData = [
    {
      id: "Tore von Außen",
      label: "Tore von Außen",
      value: wingGoals,
      color: "hsl(219, 70%, 50%)",
    },
    {
      id: "Tore vom Kreis",
      label: "Tore vom Kreis",
      value: pivotGoals,
      color: "hsl(282, 70%, 50%)",
    },
    {
      id: "Tore vom Rückraum",
      label: "Tore vom Rückraum",
      value: backGoals,
      color: "hsl(60, 70%, 50%)",
    },
  ];

  return goalData;
};
export const FormatSpecificGoalDataAway = ({ data }) => {
  const awayLineup = data.lineup.away;

  const wingPlayers = awayLineup.filter(
    (player) => player.position === "RA" || player.position === "LA"
  );
  const pivotPlayers = awayLineup.filter((player) => player.position === "KM");
  const backPlayers = awayLineup.filter(
    (player) =>
      player.position === "RL" ||
      player.position === "RM" ||
      player.position === "RR" ||
      player.position === "TW"
  );
  const sumGoals = (players) =>
    players.reduce((total, player) => total + player.goals, 0);

  let wingGoals = sumGoals(wingPlayers);
  let pivotGoals = sumGoals(pivotPlayers);
  let backGoals = sumGoals(backPlayers);
  const goalData = [
    {
      id: "Tore von Außen",
      label: "Tore von Außen",
      value: wingGoals,
      color: "hsl(219, 70%, 50%)",
    },
    {
      id: "Tore vom Kreis",
      label: "Tore vom Kreis",
      value: pivotGoals,
      color: "hsl(282, 70%, 50%)",
    },
    {
      id: "Tore vom Rückraum",
      label: "Tore vom Rückraum",
      value: backGoals,
      color: "hsl(60, 70%, 50%)",
    },
  ];

  return goalData;
};
