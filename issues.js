const issues = [];

export const addIssue = (id, lobbyID, title, link, priority, isCurrent) => {
  if (!title) return { error: 'Player name is required' };

  const issue = { id, lobbyID, title, link, priority, isCurrent };
  issues.push(issue);
  return issue;
};

export const getIssue = (id) => {
  let player = issues.find((player) => player.id == id);
  return player;
};

export const deleteIssue = (id) => {
  const index = issues.findIndex((player) => player.id === id);
  if (index !== -1) return issues.splice(index, 1)[0];
};

export const getIssues = (lobby) =>
  issues.filter((issue) => issue.lobbyID === lobby);
