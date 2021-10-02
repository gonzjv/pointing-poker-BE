const votingsArr = [];

export const addVoting = (id, count, voters) => {
  const approveCount = Math.floor(voters / 2) + 1;
  const voting = { id, count, approveCount };
  votingsArr.push(voting);

  return { voting };
};

export const getVoting = (id) => {
  const voting = votingsArr.find((voting) => voting.id == id);
  return voting;
};

export const addVote = (votingID) => {
  const index = votingsArr.findIndex((voting) => voting.id == votingID);
  votingsArr[index].count += 1;
  return votingsArr[index];
};
export const resetVoting = (votingID) => {
  const index = votingsArr.findIndex((voting) => voting.id == votingID);
  votingsArr[index].count = 0;
  return votingsArr[index];
};
