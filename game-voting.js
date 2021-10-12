const gameVotesArr = [];

export const addGameVote = (lobbyID, playerID, issueID, cardValue) => {
  const vote = { lobbyID, playerID, issueID, cardValue };
  gameVotesArr.push(vote);
  console.log('votes: ', gameVotesArr);
  return { vote };
};

export const getGameVotes = (issueID) =>
  gameVotesArr.filter((vote) => vote.issueID === issueID);
