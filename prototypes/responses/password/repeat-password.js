const ErrorResponse = require('../global.error');

class PasswordRepeat extends ErrorResponse {

    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'PasswordRepeat';
    }
    
}

module.exports = PasswordRepeat;
