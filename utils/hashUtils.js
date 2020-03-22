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

/**
 * function to compare hash for activating the user
 * @param {string} hashString hash string from the URL
 * @param {Object} user user object for the hash to be compared
 * @returns {boolean} returns true if the passed hashString matches with the user else returns false
 */
const compareHash = function (hashString, user) {
    const hashToCompare = generateHash(user.createdAt, user.email);
    
    if (hashString === hashToCompare) {
        return true;
    }

    return false;
}

module.exports = {
    generateHash,
    compareHash
};
