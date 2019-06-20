const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , db = require('./app/models')
    , io = require('./app/socket')(server, db)
    , bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({inflate: true}));


server.listen(8080, () => console.log('Server running on 8080'));

require('./app/routes')(app, db, io);