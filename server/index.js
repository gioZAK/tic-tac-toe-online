const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const {
  createGame,
  joinGame,
  makeMove,
  restartGame,
  getGame,
  getPlayerSymbol,
  cleanupGame
} = require('./gameManager');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('createGame', (roomId) => {
    createGame(roomId, socket.id);
    socket.join(roomId);

    const game = getGame(roomId);

    socket.emit('playerInfo', {
      roomId,
      role: 'playerA',
      symbol: getPlayerSymbol(roomId, socket.id)
    });

    io.to(roomId).emit('gameUpdate', game);
    console.log(`🎮 Game created: ${roomId}`);
  });

  socket.on('joinGame', (roomId) => {
    const success = joinGame(roomId, socket.id);
    if (success) {
      socket.join(roomId);

      const game = getGame(roomId);

      socket.emit('playerInfo', {
        roomId,
        role: 'playerB',
        symbol: getPlayerSymbol(roomId, socket.id)
      });

      io.to(roomId).emit('gameUpdate', game);
      console.log(`🙋 Player joined: ${roomId}`);
    } else {
      socket.emit('joinError', 'Room full or not found');
    }
  });

  socket.on('makeMove', ({ roomId, index, symbol }) => {
    const result = makeMove(roomId, index, symbol, socket.id);
    if (result) {
      io.to(roomId).emit('gameUpdate', result);
    }
  });

  socket.on('restartGame', (roomId) => {
    const result = restartGame(roomId);
    if (result) {
      io.to(roomId).emit('gameUpdate', result);
    }
  });

  socket.on('disconnecting', () => {
    for (let roomId of socket.rooms) {
      if (roomId !== socket.id) {
        console.log(`❌ User disconnected from room: ${roomId}`);
        cleanupGame(roomId);
        io.to(roomId).emit('gameEnded', 'Opponent disconnected');
      }
    }
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
