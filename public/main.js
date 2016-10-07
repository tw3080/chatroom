$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var userList = $('#user-list');

    /*
    var addMessage = function(username, message) {
        messages.append('<div>' + username + ': '+ message + '</div>');
    };
    */

    socket.on('connect', function() {
        socket.emit('adduser', prompt('Enter a username:'));
    });

    // Updates the chat box with info about user activity (e.g., connects and disconnects)
    socket.on('updatechat', function(data) {
        messages.append(data + '<br>');
    });

    // Updates chat box with messages sent by users
    socket.on('addmessage', function(username, message) {
        messages.append('<b>' + username + '</b>: ' + message + '<br>');
    });

    // Updates the list of online users
    socket.on('updateuserlist', function(usernames) {
        userList.empty();
        userList.append('<b>online:</b><br>');
        for (var user in usernames) {
            userList.append(usernames[user] + '<br>');
        }
    });

    /*
    socket.on('newuser', function(username, userCount) {
        messages.append(username + ' has come online<br>');
        // userList.append(username + '<br>');
        messages.append(userCount + ' users online<br>');
    });
    */

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        // addMessage(message);
        // socket.emit('message', message);
        socket.emit('sendchat', message);
        input.val('');
    });

    // socket.on('message', addMessage);
});
