var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', (socket) => {
  socket.username = "Anonymous"

  socket.on('change username', (name) => {
    socket.username = name
    io.emit('chat info', socket.username + ' is connected')
  })
  socket.on('disconnect', () => {
    io.emit('chat info', socket.username + ' is disconnect')
  });
  socket.on('chat message', (msg) => {
    if (msg.replace(/\s+/g, '').length != 0){
      io.emit('chat message', {message: msg, user: socket.username});
    }
  });
});

http.listen(3001, () => {
  console.log('listening on *:3001');
});
