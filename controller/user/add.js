const models = require('../../models');
const successResponse = require('../../prototypes/responses/user/add');
const messages = require('../../resources/string/resources');

/**
 * add the use to the Users table
 * @param {User} user User object to be inserted into user table
 */
const add = function (user) {
    return models.Users.create(user).then(user => {
        const response = successResponse.getSuccessResponse(200, messages.user.add);
        response.user = user;

        return Promise.resolve(response);
    })
}

module.exports = add;
