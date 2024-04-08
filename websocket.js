const socketIo = require("socket.io");

function initializeWebsocketServer(server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('stream', (data) => {
      socket.broadcast.emit('stream', data);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = initializeWebsocketServer;
