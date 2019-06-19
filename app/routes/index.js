const login = require('./login')
    , signUp = require('./signUp')
    , getChatList = require('./getChatList');

module.exports = function (app, db) {
    login(app, db);
    signUp(app, db);
    getChatList(app, db);
};