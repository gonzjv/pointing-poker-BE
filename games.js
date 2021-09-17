const games = [];

const createGame = (id) => {
  const game = { id };
  games.push(game);

  return game;
};

module.exports = { createGame };
