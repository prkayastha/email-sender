'use strict';

const ErrorResponse = require('../global.error');
/**
 * class to indicate password error
 */
class UsernamePasswordNotMatchError extends ErrorResponse {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = 'UsernamePasswordNotMatchError';
    }
}

module.exports = UsernamePasswordNotMatchError;
