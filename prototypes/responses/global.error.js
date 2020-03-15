const Response = require('./global.success');

/**
 * Class for global error
 */
class ErrorResponse extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 0;
        this.name = null;
    }
}

module.exports = ErrorResponse;
