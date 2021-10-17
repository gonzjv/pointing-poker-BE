const gameVotesArr = [];

export const addGameVote = (lobbyID, playerID, issueID, cardValue) => {
  const vote = { lobbyID, playerID, issueID, cardValue };
  const index = gameVotesArr.findIndex((vote) => vote.playerID === playerID);
  index !== -1 ? gameVotesArr.splice(index, 1, vote) : gameVotesArr.push(vote);
  console.log('votes: ', gameVotesArr);
  return { vote };
};

export const getGameVotes = (issueID) =>
  gameVotesArr.filter((vote) => vote.issueID === issueID);
