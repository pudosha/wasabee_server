const middleware = require('./../jwtMiddleware');

module.exports = function (app, db) {
    app.post('/getMessages', middleware.checkToken, (req, res) => {
        let chatID = req.body.chatID,
            lastMessageID = req.body.lastMessageID,
            messageCount = req.body.messageCount;

        messageCount = (messageCount === undefined) ? 50 : messageCount;

        console.log(req.username);

        Op = db.Sequelize.Op;

        whereClause = {'chatID': chatID};
        if (lastMessageID !== undefined)
            whereClause['messageID'] = {[Op.lt]: lastMessageID};

        db.ChatUsers.findOne({
            where: {
                chatID: chatID,
                username: req.username,
            }
        }).then(function (data) {
            if (data) {
                db.Messages.findAll({
                    limit: +messageCount,
                    where: whereClause,
                    order: [['messageID', 'DESC']],
                }).then(messages => {
                    messages.reverse();
                    console.log(messages);
                    res.json(messages);
                })
            } else {
                console.log("Unauthorized access attempt");
            }
        });
    })
};
