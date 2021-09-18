const dealers = [];

const addDealer = (lobbyID, firstName, lastName, jobPosition) => {
  if (!firstName) return { error: 'First name is required' };

  const dealer = { lobbyID, firstName, lastName, jobPosition };
  dealers.push(dealer);

  return { dealer };
};

const getDealer = (id) => {
  let dealer = dealers.find((dealer) => dealer.lobbyID == id);
  return dealer;
};

module.exports = { addDealer, getDealer };
