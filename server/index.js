const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
// Only allow your React origin
app.use(cors({ origin: 'http://localhost:3000' }));

const server = http.createServer(app);

// And make Socket.io share that same policy:
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log(`🔌 User connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});