'use strict';

const models = require('../../models');
const successResponse = require('../../prototypes/responses/user/add');
const UserAddError = require('../../prototypes/responses/user/error.add');
const messages = require('../../resources/string/resources');

/**
 * add the use to the Users table
 * @param {User} user User object to be inserted into user table
 */
const add = function (user) {
    return checkUnique(user.email, user.username).then(result => {
        if (result) {
            return models.Users.create(user).then(user => {
                const response = successResponse.getSuccessResponse(200, messages.user.add);
                response.user = user;

                return Promise.resolve(response);
            });
        }
    });
}

/**
 * check if user with email is already register. If not check availability of username. 
 * throws error if either email or username is not available. Else, returns a resolved promise
 * @param {string} emailString email to be checked for availability
 * @param {string} usernameString username to be checked for availability
 * @returns {Promise<boolean>}
 * @throws {UserAddError} 
 */
const checkUnique = function (emailString, usernameString) {
    let whereCondition = {
        email: emailString,
        deleted: false
    };

    return models.Users.count({
        where: whereCondition
    }).then(count => {
        if (count > 0) {
            const error = new UserAddError(messages.error.user.multipleEmail);
            error.statusCode = 400;
            throw error;
        }
        let whereCondition = {
            username: usernameString,
            deleted: false
        };
        return models.Users.count({
            where: whereCondition
        });
    }).then(count => {
        if (count > 0) {
            const error = new UserAddError(messages.error.user.usernameUnavailable);
            error.statusCode = 400;
            throw error;
        }
        return Promise.resolve(true);
    });
}

module.exports = add;
