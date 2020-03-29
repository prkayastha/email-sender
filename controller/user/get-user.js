const models = require('../../models');

const SuccessResponse = require('../../prototypes/responses/global.success');

const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');

/**
 * function to get user by id
 * @param {number} userId user id of user to be retrived
 */
const getUserById = function (userId) {
    const whereCondition = { id: userId, deleted: false };
    return models.Users.findOne({
        include: [
            { model: models.Roles }
        ],
        where: whereCondition
    }).then(user => {
        if (!user) {
            const message = stringResources.error.user.userNotFoundById;
            const error = new UserNotFoundError(stringUtils.format(message, userId));
            error.statusCode = 400;
            throw error;
        }

        return Promise.resolve(user);
    });
}

module.exports = getUserById;
