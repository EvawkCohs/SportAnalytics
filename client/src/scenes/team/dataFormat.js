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
