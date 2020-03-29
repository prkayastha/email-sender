const env = process.env.NODE_ENV || 'development';
const settings = require('../config/settings.json')[env];

const jwt = require('jsonwebtoken');

const decode = function (req) {
    const tokenFormat = new RegExp('Bearer\\s(.*)');
    const header = req.get('Authorization');

    if (!tokenFormat.test(header)) {
        throw new Error('Malformed jwt token');
    }

    const groups = tokenFormat.exec(header);
    return jwt.verify(groups[1], settings.tokenSecret)
}

module.exports = decode;
