const cards = [];

export const choiseCards = (type) => {
  if (type === 'poverOfTwo') {
    cards.length = 0;
    for (let i = 0; i < 8; i++) {
      const valueCard = Math.pow(2, i);
      cards.push({ lobbyID, valueCard });
    }
  }
};

export const getCards = (lobbyID) =>
  cards.filter((card) => card.lobbyID === lobbyID);
