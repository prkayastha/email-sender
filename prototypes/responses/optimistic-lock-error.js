'use strict';

const ErrorResponse = require('./global.error');

class OptimisticLockError extends ErrorResponse {
    constructor() {
        super('Version mismatch.');
        this.statusCode = 423;
        this.name = 'OptimisticLockError';
    }
}

module.exports = OptimisticLockError;
