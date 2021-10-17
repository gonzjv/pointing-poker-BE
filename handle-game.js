const handleGame = (socket, io) => {
  socket.on('startRound', (lobbyID) => {
    io.in(lobbyID).emit('dealerStartRound');
  });
};

export default handleGame;
