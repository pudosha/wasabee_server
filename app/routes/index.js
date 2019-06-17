const login = require('./login')
    , signUp = require('./signUp');

module.exports = function (app, db) {
    login(app, db);
    signUp(app, db);
};