const middleware = require('./../jwtMiddleware');

module.exports = function (app, db) {
    app.get('/getMessages', middleware.checkToken, (req, res) => {
        let chatID = req.query.chatID,
            lastMessageID = req.query.lastMessageID,
            messageCount = req.query.messageCount;

        messageCount = (messageCount === undefined) ? 50 : messageCount;

        Op = db.Sequelize.Op;

        let whereClause = {'chatID': chatID};
        if (lastMessageID !== undefined)
            whereClause['messageID'] = {[Op.lt]: lastMessageID};
        else
            console.log("No lastMessageID specified");

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
