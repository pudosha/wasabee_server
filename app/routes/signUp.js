const jwt = require('jsonwebtoken')
    , config = require('./../config');


module.exports = function (app, db) {
    app.post('/signUp', (req, res, next) => {
            let username = req.body.username,
                password = req.body.password;

            db.Users.findOne({
                where: {username: username}
            }).then(function (user) {
                if (user) {
                    res.sendStatus(401);
                } else {
                    db.Users.create({
                        username: username,
                        password: password,
                    }).then(function (user) {
                        let token = jwt.sign({username: user.username}, config.secret);
                        res.json({
                            token: token,
                            username: user.username,
                        });
                    })
                }
            });
        }
    );
};