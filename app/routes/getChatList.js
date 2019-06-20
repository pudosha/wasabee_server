const middleware = require('./../jwtMiddleware');

module.exports = function (app, db) {
    app.get('/getChatList', middleware.checkToken, (req, res) => {
        db.ChatUsers.findAll({
            where: {username: req.username},
        }).then(chats => {
            console.log(req.username);
            console.log(chats);
            return db.Sequelize.Promise.map(chats, function (chat) {
                return db.Messages.findOne({
                    attributes: ['username', 'message', 'date'],
                    where: {chatID: chat.get('chatID')},
                    order: [['date', 'DESC']],
                    include: [{model: db.Chats}]
                });
            })
        }).then(messages => {
            console.log("chats");
            console.log(messages);
            res.json(messages);
        })
    });
};