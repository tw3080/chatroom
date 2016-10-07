var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

// TODO:
var userCount = 0; // Counts number of users connected
var usernames = {}; // Object containing usernames

io.on('connection', function(socket) {
    // console.log('Client connected');

    // Stores usernames in the socket session for this client and emits a message about that user coming online
    socket.on('adduser', function(username) {
        socket.username = username;
        usernames[username] = username;
        userCount++;
        socket.broadcast.emit('updatechat', '<b>' + username + '</b> has come online');
        // socket.broadcast.emit('newuser', username, userCount);
        io.sockets.emit('updateuserlist', usernames);

        console.log(username + ' has connected');
        console.log(usernames);
        console.log(userCount + ' user(s) connected');
        console.log('-----');
    });

    // Removes user from usernames list and emits message about user going offline
    socket.on('disconnect', function() {
        delete usernames[socket.username];
        socket.broadcast.emit('updatechat', '<b>' + socket.username + '</b> has gone offline');
        userCount--;
        io.sockets.emit('updateuserlist', usernames);

        console.log(socket.username + ' has disconnected');
        console.log(usernames);
        console.log(userCount + ' user(s) connected');
        console.log('-----');
    });

    socket.on('sendchat', function(message) {
        io.sockets.emit('addmessage', socket.username, message);
    });

    /*
    socket.on('message', function(message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', socket.username, message);
    });
    */
});

server.listen(process.env.PORT || 8080);
