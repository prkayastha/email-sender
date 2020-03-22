const ErrorResponse = require('../global.error');

class UserNotFoundError extends ErrorResponse {
    constructor(message) {
        super(message)
        this.name = 'UserNotFoundError';
    }
}

module.exports = UserNotFoundError;
