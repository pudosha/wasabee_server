module.exports = function (server, db) {
    const io = require('socket.io').listen(server)
        , middleware = require('./jwtMiddleware');

    io.use(middleware.checkTokenSocketio);

    io.usernameToSocketID = {};

    io.sockets.on('connection', function (socket) {
        io.usernameToSocketID[socket.username] = socket.id;

        db.Users.update(
            {isOnline: true},
            {where: {username: socket.username}});

        db.ChatUsers.findAll({
            attributes: [['chatID', 'ID'],],
            where: {username: socket.username}
        }).then(chats => {
            chats.forEach(chat => {
                console.log(chat.get('ID'));
                socket.join(chat.get('ID'));
            });
        });

        function ifAuthorized(msg, next) {
            msg = JSON.parse(msg);
            console.log(msg);

            db.ChatUsers.findOne({
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
            ifAuthorized(msg, function (msg) {
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
            ifAuthorized(msg, function (msg) {
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
            ifAuthorized(msg, function (msg) {
                db.Messages.destroy({
                    where: {messageID: message.messageID}
                }).then(message => {
                    console.log(message.toJSON());
                    io.to(msg.chatID).emit('deleteMessage', message);
                })
            })
        });

        socket.on('disconnect', function () {
            delete io.usernameToSocketID[socket.username];

            db.Users.update(
                {isOnline: false},
                {where: {username: socket.username}});
        });
    });

    return io;
};
