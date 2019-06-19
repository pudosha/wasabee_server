const middleware = require('./../jwtMiddleware');

module.exports = function (app, db) {
    app.post('/createChat', middleware.checkToken, (req, res) => {
        let chatName = req.body.chatName,
            usernames = req.body.usernames;
        db.Chats.create({
            chatName: chatName,
        }).then(chat => {
            usernames.forEach(username => {
                db.chatUsers.create({
                    chatID: chat.chatID,
                    username: username,
                })
            })
        })
    })
};