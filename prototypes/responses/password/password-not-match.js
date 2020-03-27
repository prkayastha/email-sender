'use strict';

const ErrorResponse = require('../global.error');
/**
 * class to indicate password error
 */
class PasswordNotMatch extends ErrorResponse {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'PasswordNotMatch';
    }
}

module.exports = PasswordNotMatch;
