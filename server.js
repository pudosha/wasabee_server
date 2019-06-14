const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , mysql = require('mysql')
    , bodyParser = require('body-parser')
    , config = require("./app/config");


//app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended: true}));

server.listen(8080, () => console.log('Server running on 8080'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: config.dbLogin,
    password: config.dbPassword,
    database: 'wasabee'
});

require('./app/routes')(app, connection);

