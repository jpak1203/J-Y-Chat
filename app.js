var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;
var Firebase = require("firebase");

process.env.PWD = process.cwd();

app.use(express.static(process.env.PWD+'/public'));


io.on('connection', function(socket) {

  socket.on('add user', function(data, callback) {
      callback(true);
      socket.username = data;
      io.sockets.emit('user joined', {nick: socket.username});
    });

  socket.on('send message', function(data) {
    var msg = data.trim();
    io.sockets.emit('new message', {msg: msg, nick: socket.username});
  });

  socket.on('disconnect', function(data) {
    if (!socket.username) return;
    io.sockets.emit('user left', {nick:socket.username});
  });
});

http.listen(port, function() {
  console.log('listening on port 5000');
});
