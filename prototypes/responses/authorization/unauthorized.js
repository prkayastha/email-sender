'use strict';
const ErrorResponse = require('../global.error');

class UnauthorizedError extends ErrorResponse {
    constructor(message){
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}

module.exports = UnauthorizedError;
