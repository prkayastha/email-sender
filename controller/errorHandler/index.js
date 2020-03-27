const UserAddError = require('../../prototypes/responses/user/error.add');
const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');
const UserUpdateError = require('../../prototypes/responses/user/error.update');
const PasswordNotMatch = require('../../prototypes/responses/password/password-not-match');
const PasswordRepeat = require('../../prototypes/responses/password/repeat-password');

/**
 * function to handle the errors
 * @param {res} res Node response object
 * @param {UserAddError | Error} error error to be handled
 */
const handle = function(res, error) {
    console.log(error);
    let response = null;
    switch (true) {
        case (error instanceof UserAddError
            || error instanceof UserNotFoundError
            || error instanceof UserUpdateError
            || error instanceof PasswordNotMatch
            || error instanceof PasswordRepeat ): {
            response = {
                statusCode: error.statusCode || 500,
                message: error.message
            };
            break;
        }
        default: {
            response = {
                statusCode: 500,
                message: 'Internal Server Error'
            };
            break;
        }
    }
    res.status(response.statusCode);
    res.send(response);
}

module.exports = handle;
