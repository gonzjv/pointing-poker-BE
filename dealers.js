const dealers = [];

export const addDealer = (lobbyID, firstName, lastName, jobPosition) => {
  if (!firstName) return { error: 'First name is required' };

  const dealer = { lobbyID, firstName, lastName, jobPosition };
  dealers.push(dealer);

  return { dealer };
};

export const getDealer = (id) => {
  let dealer = dealers.find((dealer) => dealer.lobbyID == id);
  return dealer;
};
