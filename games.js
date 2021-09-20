const games = [];

export const createGame = (id) => {
  const game = { id };
  games.push(game);

  return game;
};
