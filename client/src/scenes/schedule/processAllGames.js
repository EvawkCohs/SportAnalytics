const { useFindExistingGamesQuery } = require("state/api");

async function useProcessAllGames(allGamesDetails, gameIds) {
  try {
    //Vorhandene Spiele suchen

    const existingGames = await useFindExistingGamesQuery(gameIds).data;
    //Ids vorhandener Spiele
    const existingGameIds = existingGames
      .filter((game) => game?.summary?.id)
      .map((game) => game.summary.id);

    //Filtern
    const gamesToUpdate = allGamesDetails.filter((game) =>
      existingGameIds.includes(game.summary.id)
    );
    const gamesToInsert = allGamesDetails.filter(
      (game) => !existingGameIds.includes(game.summary.id)
    );

    console.log(gamesToUpdate);
    console.log(gamesToInsert);
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Spiele: ", error);
  }
}
export default useProcessAllGames;
