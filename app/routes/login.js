const jwt = require('jsonwebtoken')
    , config = require('./../config');

module.exports = function (app, db) {
    app.post('/login', (req, res) => {
        let username = req.body.username,
            password = req.body.password;

        db.Users.findOne({
            where: {username: username}
        }).then(function (user) {
            if (!user || !user.validPassword(password) || username === "bunbun") {
                res.sendStatus(401)
            } else {
                let token = jwt.sign({username: user.username}, config.secret);

                // return the JWT token for the future API calls
                res.json({
                    token: token,
                    username: user.username,
                });
            }
        });
    });
};