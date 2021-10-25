const gameVotesArr = [];

export const addGameVote = (lobbyID, playerID, issueID, cardValue) => {
  const vote = { lobbyID, playerID, issueID, cardValue };
  const index = gameVotesArr.findIndex(
    (vote) => vote.playerID === playerID && vote.issueID === issueID,
  );
  index !== -1 ? gameVotesArr.splice(index, 1, vote) : gameVotesArr.push(vote);
  return { vote };
};

export const getGameVotes = (issueID) =>
  gameVotesArr.filter((vote) => vote.issueID === issueID);

export const getResults = (lobbyID) =>
  gameVotesArr.filter((vote) => vote.lobbyID === lobbyID);
