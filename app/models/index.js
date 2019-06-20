const Sequelize = require('sequelize')
    , config = require('./../config');

const db = new Sequelize('wasabee', config.dbLogin, config.dbPassword, {
    host: 'localhost',
    dialect: 'mysql',
});

db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Chats = require('./Chats')(db, Sequelize)
    , Messages = require('./Messages')(db, Sequelize)
    , Users = require('./Users')(db, Sequelize)
    , ChatUsers = require('./ChatUsers')(db, Sequelize);

Messages.belongsTo(Chats, {
    foreignKey: 'chatID',
    constraints: false
});

db.sync().then(() => {
    Users.findOrCreate({
        where: {username: "bunbun"},
        defaults: {
            username: "bunbun",
            password: "bunbunbun"
        },
    });
});


module.exports = {
    Chats: Chats,
    Messages: Messages,
    Users: Users,
    ChatUsers: ChatUsers,
    Sequelize: Sequelize,
};