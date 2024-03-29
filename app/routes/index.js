const login = require('./login')
    , signUp = require('./signUp')
    , getChatList = require('./getChatList')
    , createChat = require('./createChat')
    , getMessages = require('./getMessages');

module.exports = function (app, db, io) {
    login(app, db);
    signUp(app, db);
    getChatList(app, db);
    createChat(app, db, io);
    getMessages(app, db);
};