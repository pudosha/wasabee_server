const middleware = require('./../jwtMiddleware');

function addUser(db, io, req, chatID, username) {
    db.ChatUsers.findOrCreate({
        where: {
            chatID: chatID,
            username: username,
        },
        defaults: {
            chatID: chatID,
            username: username,
        }

    });

    let socket = io.sockets.connected[io.usernameToSocketID[req.username]];

    if (socket)
        socket.join(chatID);
    else
        console.log(`User ${req.username} is offline`);
}

module.exports = function (app, db, io) {
    app.post('/createChat', middleware.checkToken, (req, res) => {
        let chatName = req.body.chatName,
            usernames = req.body.usernames;
        db.Chats.create({
            chatName: chatName,
        }).then(chat => {

            // Chat must have at least one message
            db.Messages.create({
                chatID: chat.chatID,
                username: "bunbun",
                message: `${req.username} created the chat "${chat.chatName}"`,
            });

            usernames.push(req.username);
            usernames.forEach(username => {addUser(db, io, req, chat.chatID, username)});

            console.log(chat);
            res.json(chat);
        })
    })
};