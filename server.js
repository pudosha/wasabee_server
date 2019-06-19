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

    db.Users.update(
        {isOnline: true},
        {where: {username: socket.username}});

    db.ChatUser.findAll({
        attributes: [['chatID', 'ID'],],
        where: {username: socket.username}
    }).then(chats => {
        chats.forEach(chat => {
            console.log(chat.get('ID'));
            socket.join(chat.get('ID'));
        });
    });

    function isAuthorized(msg, next) {
        msg = JSON.parse(msg);
        console.log(msg);

        db.ChatUser.findOne({
            where: {
                chatID: msg.chatID,
                username: socket.username,
            }
        }).then(function (data) {
            if (data) {
                next(msg);
            } else {
                console.log("Unauthorized access attempt");
            }
        });
    }

    socket.on('newMessage', msg => {
        isAuthorized(msg, function (msg) {
            db.Messages.create({
                chatID: msg.chatID,
                username: socket.username,
                message: msg.message,
            }).then(message => {
                console.log(message.toJSON());
                console.log(msg.chatID);
                io.to(msg.chatID).emit('newMessage', message);
            });
        })
    });


    socket.on('editMessage', msg => {
        isAuthorized(msg, function (msg) {
            db.Messages.update({
                message: msg.message,
                isEdited: true,
                where: {messageID: message.messageID}
            }).then(message => {
                console.log(message.toJSON());
                io.to(msg.chatID).emit('editMessage', message);
            })
        })
    });
    socket.on('deleteMessage', function (msg) {
        isAuthorized(msg, function (msg) {
            db.Messages.destroy({
                where: {messageID: message.messageID}
            }).then(message => {
                console.log(message.toJSON());
                io.to(msg.chatID).emit('deleteMessage', message);
            })
        })
    });

    socket.on('disconnect', function () {
        db.Users.update(
            {isOnline: false},
            {where: {username: socket.username}});
    });
});

setInterval(function () {
    db.Messages.create({
        chatID: "123",
        username: "testUser",
        message: "testMessage",
    }).then(message => {
        console.log(message.toJSON());
        console.log("123");
        io.to("123").emit('newMessage', message);
    });
}, 10000);