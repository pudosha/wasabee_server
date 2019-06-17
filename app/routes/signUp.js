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
                    res.json({
                        success: false,
                        message: 'This username is already taken'
                    });
                } else {
                    db.Users.create({
                        username: username,
                        firstName: "sampleName",
                        lastName: "sampleLastName",
                        password: password,
                    }).then(function (user) {
                        let token = jwt.sign({user_id: user.user_id}, config.secret);
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token
                        });
                    })
                }
            });
        }
    );
};

