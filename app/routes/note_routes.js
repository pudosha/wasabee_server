const middleware = require('../jwtMiddleware')
    , jwt = require('jsonwebtoken')
    , config = require('./../config');


module.exports = function (app, db) {
    app.post('/login', (req, res) => {
        let username = req.body.username,
            password = req.body.password;

        try {
            let query = 'SELECT user_id from users\n' +
                'WHERE username = ? and password = UNHEX(SHA2(?, 256));';

            db.query(query, [username, password], function (error, results, fields) {
                if (error) console.log(error);
                else {
                    let user_id = results[0];
                    if (user_id === undefined) {
                        res.json({
                            success: false,
                            message: 'Incorrect username or password'
                        });
                        return;
                    }

                    let token = jwt.sign({user_id: user_id}, config.secret);

                    // return the JWT token for the future API calls
                    res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                    });


                }
            });
        } catch (e) {
            res.json({
                success: false,
                message: 'Incorrect username or password'
            });
        }


    });

    app.post('/signup', (req, res, next) => {
            let username = req.body.username,
                password = req.body.password;

            let query = 'SELECT user_id from users\n' +
                'WHERE username=?';

            db.query(query, [username], function (error, results, fields) {
                if (results.length) {
                    res.json({
                        success: false,
                        message: 'This username is already taken'
                    });
                } else {
                    db.query('INSERT into users (username, password) values(?, UNHEX(SHA2(?, 256)));', [username, password]);

                    db.query('SELECT LAST_INSERT_ID();', function (error, results, fields) {
                        let token = jwt.sign({user_id: results[0]}, config.secret);
                        res.json({
                            success: true,
                            message: 'Authentication successful!',
                            token: token
                        });
                    });
                }
            });

        }
    );

    app.post('/notes', middleware.checkToken, (req, res) => {
        const note = {text: req.body.body, title: req.body.title};
        db.set(note.title, note.text);
        res.send("okok");
    });

};

