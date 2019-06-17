const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , mysql = require('mysql')
    , bodyParser = require('body-parser')
    , config = require("./app/config");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({inflate: true}));

server.listen(8080, () => console.log('Server running on 8080'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: config.dbLogin,
    password: config.dbPassword,
    database: 'wasabee'
});

require('./app/routes')(app, connection);


io.sockets.on('connection', function (socket) {
    console.log((socket.id).toString());

    socket.emit('message', {'id': 'abc'});

    socket.on('message', function moveRect(msg) {
        console.log(msg);
    });

    socket.on('disconnect', function() {

    });
});