const jwt = require('jsonwebtoken')
    , config = require('./../config');

module.exports = function (app, db) {
    app.post('/login', (req, res) => {
        let username = req.body.username,
            password = req.body.password;

        db.Users.findOne({
            where: {username: username}
        }).then(function (user) {
            if (!user || !user.validPassword(password)) {
                res.json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            } else {
                console.log(user.validPassword(password));
                let token = jwt.sign({user_id: user.user_id}, config.secret);

                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            }
        });
    });
};