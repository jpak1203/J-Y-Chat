var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

process.env.PWD = process.cwd();

app.use(express.static(process.env.PWD+'/public'));

var users = {};
var numUsers = 0;

io.on('connection', function(socket) {

  socket.on('add user', function(data, callback) {
    if (data in users) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      users[socket.username] = data;
      ++numUsers;
      io.sockets.emit('user joined', {nick: socket.username, numUsers: numUsers});
    }
  });

  socket.on('send message', function(data) {
    var msg = data.trim();
    io.sockets.emit('new message', {msg: msg, nick: socket.username});
  });

  socket.on('disconnect', function(data) {
    if (!socket.username) return;
    --numUsers;
    io.sockets.emit('user left', {nick:socket.username, numUsers: numUsers});
    delete users[socket.username];
  });
});

http.listen(port, function() {
  console.log('listening on port 5000');
});
