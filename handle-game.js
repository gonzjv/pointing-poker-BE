import { addGameVote, getGameVotes, getResults } from './game-voting.js';

const handleGame = (socket, io) => {
  socket.on('startGame', (lobbyID) => {
    io.in(lobbyID).emit('dealerStartGame');
  });

  socket.on('startRound', (lobbyID) => {
    io.in(lobbyID).emit('dealerStartRound');
  });

  socket.on('addGameVote', (lobbyID, issueID, cardValue) => {
    const vote = addGameVote(lobbyID, socket.id, issueID, cardValue);

    socket.join(lobbyID);
    io.in(lobbyID).emit('sendVotes', getGameVotes(issueID));
  });

  socket.on('stopGame', (lobbyID) => {
    io.in(lobbyID).emit('dealerStopGame', getResults(lobbyID));
  });
  socket.on('changeCurrentIssue', (issue, lobbyID) => {
    io.in(lobbyID).emit('dealerSetIssue', issue);
  });
};

export default handleGame;
