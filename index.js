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
import { addPlayer, deletePlayer, getPlayer, getPlayers } from './players.js';
import { addVoting, getVoting, addVote, resetVoting } from './voting.js';
import { addIssue, getIssues } from './issues.js';
import handleGame from './handle-game.js';

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
    if (player) {
      io.in(player.lobbyID).emit('notification', `${player.firstName} just left`);
      io.in(player.lobbyID).emit('players', getPlayers(player.lobbyID));
      socket.leave(player.lobbyID);
      callback();
    }
  });
  socket.on('createGame', ({ firstName, lastName, jobPosition }, callback) => {
    const game = createGame(socket.id);
    const { dealer, error } = addDealer(
      socket.id,
      socket.id,
      firstName,
      lastName,
      jobPosition,
    );
    if (error) {
      return callback(error);
    }
    console.log('DEALER: ', dealer);
    socket.join(dealer.lobbyID);
    io.in(dealer.lobbyID).emit('dealer', getDealer(dealer.lobbyID));
    callback();
  });
  socket.on('sendMessage', (message) => {
    const user = getPlayer(socket.id) || getDealer(socket.id);
    io.in(user.lobbyID).emit('message', { user: user.firstName, text: message });
  });
  socket.on('deletePlayer', (id) => {
    const player = deletePlayer(id);
    io.in(player.lobbyID).emit('players', getPlayers(player.lobbyID));
    io.to(player.id).emit('kickFromLobby');
    io.in(player.lobbyID).emit(
      'notification',
      `${player.firstName} kicked by dealer`,
    );
  });
  socket.on('startVoting', (player, initiatorID) => {
    const initiator = getPlayer(initiatorID);
    const votersCount = getPlayers(initiator.lobbyID).length;
    const voting = addVoting(initiatorID, 1, votersCount);
    socket
      .in(player.lobbyID)
      .except(player.id)
      .emit('votingPopup', player, initiator);
  });
  socket.on('vote', (votingID, player) => {
    const voting = addVote(votingID);
    socket.emit('voteCount', voting);
    const kickPlayer = () => {
      deletePlayer(player.id);
      io.to(player.id).emit('kickFromLobby');
      io.in(player.lobbyID).emit('players', getPlayers(player.lobbyID));
      io.in(player.lobbyID).emit(
        'notification',
        `${player.firstName} kicked by voting`,
      );
      io.in(player.lobbyID).emit('closeVoting');
      resetVoting(votingID);
    };
    voting.count >= voting.approveCount ? kickPlayer() : {};
  });
  socket.on('addIssue', ({ lobbyID, title, link, priority }, callback) => {
    const { issue, error } = addIssue(
      lobbyID + title,
      lobbyID,
      title,
      link,
      priority,
      true,
    );
    if (error) {
      return callback(error);
    }
    socket.join(lobbyID);
    io.in(lobbyID).emit('refreshIssues', getIssues(lobbyID));
    console.log('issues: ', getIssues(lobbyID));
    callback();
  });
  handleGame(socket, io);
});
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

httpServer.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
