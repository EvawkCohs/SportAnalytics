export const GetPlayerStatisticsPerGame = (
  allGamesDetails,
  playerId,
  teamId
) => {
  const playerStatisticsPerGame = allGamesDetails
    .map((game) => {
      if (game.summary.homeTeam.id === teamId) {
        const homeLineup = game.lineup.home.map((obj) => ({
          ...obj,
          team: game.summary.homeTeam.name,
          acronym: game.summary.homeTeam.acronym,
          opponent: game.summary.awayTeam.name,
          opponentacr: game.summary.awayTeam.acronym,
          location: "(H)",
        }));
        return homeLineup;
      } else if (game.summary.awayTeam.id === teamId) {
        const awayLineup = game.lineup.away.map((obj) => ({
          ...obj,
          team: game.summary.awayTeam.name,
          acronym: game.summary.awayTeam.acronym,
          opponent: game.summary.homeTeam.name,
          opponentacr: game.summary.homeTeam.acronym,
          location: "(A)",
        }));
        return awayLineup;
      }
      return null;
    })
    .filter((lineup) => lineup.length > 0)
    .flat()
    .filter((player) => player.id === playerId);

  return playerStatisticsPerGame;
};

export const GetPlayerGoalsDataLine = (playerStatisticsPerGame) => {
  const playerGoalDataLine = [
    {
      id: `${playerStatisticsPerGame[0].firstname} ${playerStatisticsPerGame[0].lastname}`,
      color: "hsl(55, 70%, 50%)",
      data: [],
    },
  ];
  playerStatisticsPerGame.map((game, index) => {
    const point1 = { x: index + 1, y: game.goals };
    playerGoalDataLine[0].data.push(point1);
  });
  return playerGoalDataLine;
};
