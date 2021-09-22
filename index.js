import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

import { addDealer, getDealer } from './dealers.js';
import { createGame } from './games.js';
import { addPlayer, deletePlayer, getPlayers } from './players.js';

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
    socket
      .in(lobbyID)
      .emit('notification', `${player.firstName} just entered the room`);
    console.log('rooms after login: ', io.sockets.adapter.rooms);
    io.in(lobbyID).emit('dealer', getDealer(lobbyID));
    io.in(lobbyID).emit('players', getPlayers(lobbyID));

    callback();
  });
  socket.on('checkLobbyID', ({ lobbyID }, callback) => {
    console.log('check rooms: ', io.sockets.adapter.rooms);
    io.sockets.adapter.rooms.has(lobbyID)
      ? callback()
      : callback('Lobby does not exist');
  });
  socket.on('exit', (callback) => {
    const player = deletePlayer(socket.id);
    console.log('player= ', player);
    if (player) {
      io.in(player.lobbyID).emit('notification', {
        title: 'Someone just left',
        description: `${player.firstName}`,
      });
      io.in(player.lobbyID).emit('players', getPlayers(player.lobbyID));
      socket.leave(player.lobbyID);
      callback();
    }
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
    io.in(dealer.lobbyID).emit('dealer', getDealer(dealer.lobbyID));
    callback();
  });
  socket.on('sendMessage', (message) => {});
  socket.on('disconnect', () => {});
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

httpServer.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
