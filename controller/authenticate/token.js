const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];

/**
 * function to generate jwt for user
 * @param {Object} user payload data for jwt
 */
const generate = function (user) {
    const lifeInMinute = +settings.authentication.tokenLife;
    return jwt.sign(user, settings.tokenSecret, { expiresIn: lifeInMinute * 60 });
};

const checkToken = ejwt({ secret: settings.tokenSecret });

module.exports = {
    generate,
    checkToken
};
