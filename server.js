const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , mysql = require('mysql')
    , bodyParser = require('body-parser')
    , config = require("./app/config")
    , middleware = require('./app/jwtMiddleware')
    , socketFunctions = require('./app/socketFunctions');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({inflate: true}));

io.use(middleware.checkTokenSocketio);

server.listen(8080, () => console.log('Server running on 8080'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: config.dbLogin,
    password: config.dbPassword,
    database: 'wasabee'
});

require('./app/routes')(app, connection);

io.sockets.on('connection', function (socket) {
    console.log(socket.user_id);
    socket.emit('message', {'id': 'abc'});

    socket.on('newMessage', socketFunctions.onNewMessage);
    socket.on('editMessage', socketFunctions.onEditMessage);
    socket.on('deleteMessage', socketFunctions.onDeleteMessage);

    socket.on('disconnect', function () {

    });
});