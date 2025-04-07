const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"]
  }
});

const users = {}; // { socket.id: username }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Save username and send updated user list
  socket.on('set_username', (username) => {
    users[socket.id] = username;
    io.emit('users_list', Object.entries(users).map(([id, name]) => ({ id, name })));
  });

  // Send private message to specific user
  socket.on('send_private_message', ({ to, message, from }) => {
    io.to(to).emit('receive_private_message', { message, from });
  });

  // Remove user when they disconnect
  socket.on('disconnect', () => {
    console.log(' User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('users_list', Object.entries(users).map(([id, name]) => ({ id, name })));
  });
});

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
