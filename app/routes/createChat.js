const middleware = require('./../jwtMiddleware');

function addUser(db, chatID, username) {
    db.ChatUsers.findOrCreate({
        where: {
            chatID: chatID,
            username: username,
        },
        defaults: {
            chatID: chatID,
            username: username,
        }

    })
}

module.exports = function (app, db) {
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

            usernames.forEach(username => {addUser(db, chat.chatID, username)});
            addUser(db, chat.chatID, req.username);

            console.log(chat);
            res.json(chat);
        })
    })
};