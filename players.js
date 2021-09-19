const players = [];

const addPlayer = (id, lobbyID, firstName, lastName, jobPosition) => {
  if (!firstName) return { error: 'Player name is required' };

  const player = { id, lobbyID, firstName, lastName, jobPosition };
  players.push(player);
  return { player };
};

const getPlayer = (id) => {
  let player = players.find((player) => player.id == id);
  return player;
};

const deletePlayer = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getPlayers = (lobby) => players.filter((player) => player.lobbyID === lobby);

module.exports = { addPlayer, getPlayer, deletePlayer, getPlayers };
