let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.user_id = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

let checkTokenSocketio = (socket, next) => {
    let token = socket.handshake.query.authToken; // Express headers are auto converted to lowercase

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                next(new Error('Authentication error'));
            } else {
                socket.userId = decoded.userId;
                next();
            }
        });
    } else {
        next(new Error('Authentication error'));
    }
};

module.exports = {
    checkToken: checkToken,
    checkTokenSocketio: checkTokenSocketio
};