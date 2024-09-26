export const GetTotalGoals = (games, teamId) => {
  let totalGoals = 0;
  games?.forEach((game) => {
    if (game.summary.homeTeam.id === teamId) {
      totalGoals += game.summary.homeGoals;
    } else {
      totalGoals += game.summary.awayGoals;
    }
  });
  return totalGoals;
};

export const GetLast5WinLose = (games, teamId) => {
  let last5WinLose = [];
  games?.map((game) => {
    game.summary.homeTeam.id === teamId
      ? game.summary.homeGoals > game.summary.awayGoals
        ? last5WinLose.push("win")
        : game.summary.homeGoals == game.summary.awayGoals
        ? last5WinLose.push("tie")
        : last5WinLose.push("lose")
      : game.summary.awayGoals > game.summary.homeGoals
      ? last5WinLose.push("win")
      : game.summary.awayGoals == game.summary.homeGoals
      ? last5WinLose.push("tie")
      : last5WinLose.push("lose");
  });
  return last5WinLose;
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
export const GetTotalGoalsConceded = (games, teamId) => {
  let totalGoalsConceded = 0;
  games.forEach((game) => {
    game.summary.homeTeam.id === teamId
      ? (totalGoalsConceded += game.summary.awayGoals)
      : (totalGoalsConceded += game.summary.homeGoals);
  });
  return totalGoalsConceded;
};
export const GetAverageGoalsConcededLastFive = (dataLastFiveGames, teamId) => {
  const gamesPlayed = dataLastFiveGames.length;
  let totalGoalsConcededLastFive = 0;
  dataLastFiveGames.forEach((game) => {
    game.summary.homeTeam.id === teamId
      ? (totalGoalsConcededLastFive += game.summary.awayGoals)
      : (totalGoalsConcededLastFive += game.summary.homeGoals);
  });
  return totalGoalsConcededLastFive / gamesPlayed;
};
