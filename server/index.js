require('dotenv').config(); // Load variables from .env
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

const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

const app = express();
app.use(cors({ origin: FRONTEND_ORIGIN }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
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
    const updatedGame = restartGame(roomId);
    if (updatedGame) {
      io.to(roomId).emit('gameUpdate', updatedGame);

      const { players, symbols } = updatedGame;

      // Resend playerInfo with updated symbol
      if (players.playerA && symbols[players.playerA]) {
        io.to(players.playerA).emit('playerInfo', {
          roomId,
          role: 'playerA',
          symbol: symbols[players.playerA]
        });
      }

      if (players.playerB && symbols[players.playerB]) {
        io.to(players.playerB).emit('playerInfo', {
          roomId,
          role: 'playerB',
          symbol: symbols[players.playerB]
        });
      }
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

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
