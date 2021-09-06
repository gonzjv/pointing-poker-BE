const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const { addUser, getUser, deleteUser, getUsers } = require('./users').default;
const io = require('socket.io')(http);

app.use(cors());

io.on('connection', (socket) => {
  socket.on('login', ({ name, room }, callback) => {
    const { user, error } = addUser(socket.id, name, room);
    if (error) return callback(error);
    socket.join(user.room);
    socket.in(room).emit('notification', {
      title: "Someone' here",
      description: `${user.name} just entered the room`,
    });
    io.in(room).emit('users', getUsers(room));
    callback();
  });
  socket.on('sendMessage', (message) => {});
  socket.on('disconnect', () => {});
});

app.get('/', (req, res) => {
  req.send('Server is up and running');
});

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
