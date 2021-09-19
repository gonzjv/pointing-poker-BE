const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const { addDealer, getDealer } = require('./dealers');
const PORT = process.env.PORT || 5000;
const { createGame } = require('./games');
const { addPlayer, getPlayers } = require('./players');
const io = require('socket.io')(http);

app.use(cors());

io.on('connection', (socket) => {
  socket.on('login', ({ lobbyID, firstName, lastName, jobPosition }, callback) => {
    const { player, error } = addPlayer(
      socket.id,
      lobbyID,
      firstName,
      lastName,
      jobPosition,
    );
    if (error) return callback(error);
    socket.join(player.lobbyID);
    socket.in(lobbyID).emit('notification', {
      title: "Someone' here",
      description: `${player.firstName} just entered the room`,
    });
    io.in(lobbyID).emit('dealer', getDealer(lobbyID));
    io.in(lobbyID).emit('players', getPlayers(lobbyID));

    callback();
  });
  socket.on('checkLobbyID', ({ lobbyID }, callback) => {
    console.log('rooms: ', socket.rooms);
    socket.rooms.has(lobbyID) ? callback() : callback('Lobby does not exist');
  });
  socket.on('createGame', ({ firstName, lastName, jobPosition }, callback) => {
    const game = createGame(socket.id);
    const { dealer, error } = addDealer(
      firstName + socket.id,
      firstName,
      lastName,
      jobPosition,
    );
    if (error) {
      return callback(error);
    }
    socket.join(dealer.lobbyID);
    console.log('rooms: ', socket.rooms);
    io.in(dealer.lobbyID).emit('dealer', getDealer(dealer.lobbyID));
    callback();
  });
  socket.on('sendMessage', (message) => {});
  socket.on('disconnect', () => {});
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
