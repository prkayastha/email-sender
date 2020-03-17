'use strict';

const crypto = require('crypto');

/**
 * function to generate hash for activating the user
 * @param {DateTime} createdAt DateTime when the user was created
 * @param {string} email email of the user
 */
const generateHash = function (createdAt, email) {
    const createdDate = (new Date(createdAt)).valueOf().toString();
    const stringToHash = createdDate + email;
    return crypto.createHash('sha256').update(stringToHash).digest('hex')
}

module.exports = {
    generateHash
}