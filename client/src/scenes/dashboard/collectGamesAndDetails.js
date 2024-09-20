export const GetTotalGoals = (games, teamId) => {
  let totalGoals = 0;
  games.forEach((game) => {
    if (game.summary.homeTeam.id === teamId) {
      totalGoals += game.summary.homeGoals;
    } else {
      totalGoals += game.summary.awayGoals;
    }
  });
  return totalGoals;
};

export const GetAverageGoalsLastFive = (dataLastFiveGames, teamId) => {
  const gamesPlayed = dataLastFiveGames.length;
  let totalGoalsLastFive = 0;
  dataLastFiveGames.forEach((game) => {
    if (game.summary.homeTeam.id === teamId) {
      totalGoalsLastFive += game.summary.homeGoals;
    } else {
      totalGoalsLastFive += game.summary.awayGoals;
    }
  });
  const averageGoalsLastFive = totalGoalsLastFive / gamesPlayed;
  return averageGoalsLastFive;
};

export const GetAverageAttendance = (games, teamId) => {
  const playedGames = games.filter(
    (game) =>
      game.summary.state === "Post" &&
      game.summary.attendance > 0 &&
      game.summary.homeTeam.id === teamId
  );
  let totalAttendance = 0;
  playedGames.map((game) => {
    totalAttendance += game.summary.attendance;
  });
  return totalAttendance / playedGames.length;
};

export const GetBestPeriodLastFive = (dataLastFiveGames, teamId) => {
  const gamesPlayed = dataLastFiveGames.length;
  const periodData = [
    {
      "0. - 10. Min": 0,
      "11. - 20. Min": 0,
      "21. - 30. Min": 0,
      "31. - 40. Min": 0,
      "41. - 50. Min": 0,
      "51. - 60. Min": 0,
    },
  ];

  dataLastFiveGames.map((game) => {
    for (const element of game.events) {
      if (element.type === "Goal" || element.type === "SevenMeterGoal") {
        if (game.summary.homeTeam.id === teamId) {
          const timeParts = element.time.split(":");
          const minutes = parseInt(timeParts[0], 10);
          const seconds = parseInt(timeParts[1], 10);

          if (minutes >= 0 && minutes < 10) {
            if (element.team === "Home") {
              periodData[0]["0. - 10. Min"] += 1;
            }
          } else if (minutes >= 10 && minutes < 20) {
            if (element.team === "Home") {
              periodData[0]["11. - 20. Min"] += 1;
            }
          } else if (
            minutes >= 20 &&
            (minutes < 30 || (minutes === 30 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["21. - 30. Min"] += 1;
            }
          } else if (
            minutes >= 30 &&
            (minutes < 40 || (minutes === 40 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["31. - 40. Min"] += 1;
            }
          } else if (
            minutes >= 40 &&
            (minutes < 50 || (minutes === 50 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["41. - 50. Min"] += 1;
            }
          } else if (
            minutes >= 50 &&
            (minutes < 60 || (minutes === 60 && seconds === 0))
          ) {
            if (element.team === "Home") {
              periodData[0]["51. - 60. Min"] += 1;
            }
          }
        } else if (game.summary.awayTeam.id === teamId) {
          const timeParts = element.time.split(":");
          const minutes = parseInt(timeParts[0], 10);
          const seconds = parseInt(timeParts[1], 10);

          if (minutes >= 0 && minutes < 10) {
            if (element.team === "Away") {
              periodData[0]["0. - 10. Min"] += 1;
            }
          } else if (minutes >= 10 && minutes < 20) {
            if (element.team === "Away") {
              periodData[0]["11. - 20. Min"] += 1;
            }
          } else if (
            minutes >= 20 &&
            (minutes < 30 || (minutes === 30 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["21. - 30. Min"] += 1;
            }
          } else if (
            minutes >= 30 &&
            (minutes < 40 || (minutes === 40 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["31. - 40. Min"] += 1;
            }
          } else if (
            minutes >= 40 &&
            (minutes < 50 || (minutes === 50 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["41. - 50. Min"] += 1;
            }
          } else if (
            minutes >= 50 &&
            (minutes < 60 || (minutes === 60 && seconds === 0))
          ) {
            if (element.team === "Away") {
              periodData[0]["51. - 60. Min"] += 1;
            }
          }
        }
      }
    }
  });
  //Teile die Gesamtanzahl der Tore durch die gespielten Spiele
  periodData.forEach((obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = obj[key] / gamesPlayed;
      }
    }
  });

  return periodData;
};

export const GetOverallLineupData = (games, teamId) => {
  const allLineups = games
    .map((game) => {
      if (game.summary.homeTeam.id === teamId) {
        const homeLineup = game.lineup.home.map((obj) => ({
          ...obj,
          team: game.summary.homeTeam.name,
          acronym: game.summary.homeTeam.acronym,
        }));
        return homeLineup;
      } else if (game.summary.awayTeam.id) {
        const awayLineup = game.lineup.away.map((obj) => ({
          ...obj,
          team: game.summary.awayTeam.name,
          acronym: game.summary.awayTeam.acronym,
        }));
        return awayLineup;
      }
      return null;
    })
    .filter((lineup) => lineup !== null);
  const combinedStatistics = allLineups.flat().reduce((lineup, player) => {
    if (lineup[player.id]) {
      lineup[player.id].goals += player.goals;
      lineup[player.id].penaltyGoals += player.penaltyGoals;
      lineup[player.id].penaltyMissed += player.penaltyMissed;
      lineup[player.id].penalties += player.penalties;
      lineup[player.id].yellowCards += player.yellowCards;
      lineup[player.id].redCards += player.redCards;

      lineup[player.id].blueCards =
        player.blueCards !== null
          ? (lineup[player.id].blueCards || 0) + player.blueCards
          : lineup[player.id].blueCards;
      lineup[player.id].gamesPlayed += 1;
    } else {
      lineup[player.id] = {
        ...player,
        gamesPlayed: 1,
      };
    }
    return lineup;
  }, {});

  const playerStatsArray = Object.values(combinedStatistics);
  return playerStatsArray;
};
