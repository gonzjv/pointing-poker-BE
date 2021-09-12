const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { addUser, getUser, deleteUser, getUsers } = require('./users');
const io = require('socket.io')(http);

app.use(cors());

io.on('connection', (socket) => {
  socket.on('login', ({ name, lobby }, callback) => {
    console.log('socket-login run');
    const { user, error } = addUser(socket.id, name, lobby);
    if (error) return callback(error);
    socket.join(user.lobby);
    socket.in(lobby).emit('notification', {
      title: "Someone' here",
      description: `${user.name} just entered the room`,
    });
    io.in(lobby).emit('users', getUsers(lobby));
    console.log('be-users: ', getUsers(lobby));

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
