const ErrorResponse = require('../global.error');

class UserUpdateError extends ErrorResponse {
    constructor(message) {
        super(message)
        this.name = 'UserUpdateError';
    }
}

module.exports = UserUpdateError;
