const models = require('../../models');
const SuccessResponse = require('../../prototypes/responses/global.success');

const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');

/**
 * function to update user by id. Attribute that are to be updated must be passed. All the other attributes are ignored.
 * @param {number} userId user id of user to be updated
 * @param {Object} infoToUpdate updated information of the user.
 * @returns Promise<SuccessResponse>
 * @throws {UserNotFoundError}
 */
const update = function (userId, infoToUpdate) {
    const whereCondition = { id: userId, deleted: false };
    const immutableField = ['id', 'lastSignIn', 'deleted', 'active', 'createdAt', 'updatedAt'];

    return models.Users.findOne({ where: whereCondition }).then(user => {
        if (!user) {
            const message = stringResources.error.user.userNotFoundById;
            const error = new UserNotFoundError(stringUtils.format(message, userId));
            error.statusCode = 400;
            throw error;
        }

        const updateData = user.dataValues;
        for(let attr of Object.keys(infoToUpdate)) {
            if(!immutableField.includes(attr) && updateData.hasOwnProperty(attr)) {
                updateData[attr] = infoToUpdate[attr];
            }
        }
        return models.Users.update(updateData, { where: whereCondition }).then(result => {
            if (result < 0) {
                const message = stringResources.error.user.updateFailure;
                const error = new UserUpdateError(stringUtils.format(message, userId));
                error.statusCode = 400;
                throw error;
            }

            const message = stringResources.user.updateSuccess;
            const response = SuccessResponse.getSuccessResponse(200, stringUtils.format(message, userId));
            return Promise.resolve(response);
        });
    });
}

module.exports = update;
