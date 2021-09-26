const players = [];

export const addPlayer = (id, lobbyID, firstName, lastName, jobPosition) => {
  if (!firstName) return { error: 'Player name is required' };

  const player = { id, lobbyID, firstName, lastName, jobPosition };
  players.push(player);
  return { player };
};

export const getPlayer = (id) => {
  let player = players.find((player) => player.id == id);
  return player;
};

export const deletePlayer = (id) => {
  const index = players.findIndex((player) => player.id === id);
  if (index !== -1) return players.splice(index, 1)[0];
};

export const getPlayers = (lobby) =>
  players.filter((player) => player.lobbyID === lobby);
