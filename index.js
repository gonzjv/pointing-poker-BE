const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const { addDealer, getDealer } = require('./dealers');
const PORT = process.env.PORT || 5000;
const { createGame } = require('./games');
const { addUser, getUser, deleteUser, getUsers } = require('./users');
const io = require('socket.io')(http);

app.use(cors());

io.on('connection', (socket) => {
  socket.on('login', ({ name, lobby }, callback) => {
    const { user, error } = addUser(socket.id, name, lobby);
    if (error) return callback(error);
    socket.join(user.lobby);
    socket.in(lobby).emit('notification', {
      title: "Someone' here",
      description: `${user.name} just entered the room`,
    });
    io.in(lobby).emit('users', getUsers(lobby));

    callback();
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
    console.log('lobbyID before join: ', dealer.lobbyID);
    socket.join(dealer.lobbyID);
    console.log('lobbyID after join: ', dealer.lobbyID);

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
