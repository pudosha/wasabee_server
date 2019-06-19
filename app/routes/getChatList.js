const middleware = require('./../jwtMiddleware');

module.exports = function (app, db) {
    app.post('/getChatList', middleware.checkToken, (req, res) => {
        let username = req.body.username;

        db.ChatUser.findAll({
            where: {username: username},
            include: [
                {model: messages, as: 'message'}
                ]
        }).then(chats => {
            console.log(chats);
            res.json(chats);
        })
    });
};