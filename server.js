const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , db = require('./app/database')
    , bodyParser = require('body-parser')
    , config = require("./app/config")
    , middleware = require('./app/jwtMiddleware');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({inflate: true}));

io.use(middleware.checkTokenSocketio);

server.listen(8080, () => console.log('Server running on 8080'));

require('./app/routes')(app, db);

io.sockets.on('connection', function (socket) {
    socket.emit('message', {'id': 'abc'});

    socket.on('newMessage', function (msg) {
        // TODO("Check if user has access to this chat")
        db.Messages.create({
            chatId: msg.chatId,
            userId: socket.userId,
            message: msg.message,
        })
    });
    socket.on('editMessage', function (msg) {

    });
    socket.on('deleteMessage', function (msg) {

    });

    socket.on('disconnect', function () {

    });
});