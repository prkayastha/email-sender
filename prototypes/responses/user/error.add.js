const ErrorResponse = require('../global.error');

/**
 * Class for user add error
 */
class UserAddError extends ErrorResponse {
    /**
     * initialize user add error
     * @param {string} message error message for not being able to create user
     */
    constructor(message) {
        super(message);
        this.name = 'UserAddError';
    }
}

module.exports = UserAddError;
