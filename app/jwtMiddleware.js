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
                return res.sendStatus(401);
            } else {
                req.username = decoded.username;
                next();
            }
        });
    } else {
        return res.sendStatus(401);
    }
};

let checkTokenSocketio = (socket, next) => {
    let token = socket.handshake.query.authToken; // Express headers are auto converted to lowercase

    console.log("middleware");
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                next(new Error('Authentication error'));
            } else {
                socket.username = decoded.username;
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