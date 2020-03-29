const models = require('../../models');
const SuccessResponse = require('../../prototypes/responses/global.success');

const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');

/**
 * function to delete the user by user id. The function first check the user and then updates the field deleted in user table.
 * @param {number} userId user id of the user to be deleted
 * @returns Promise<SuccessResponse>
 * @throws {UserNotFoundError}
 */
const deleteUser = function (userId, version) {
    const whereCondition = { id: userId, deleted: false };
    return models.Users.findOne({ where: whereCondition }).then(user => {
        if (!user) {
            const message = stringResources.error.user.userNotFoundById;
            const error = new UserNotFoundError(stringUtils.format(message, userId));
            error.statusCode = 400;
            throw error;
        }

        const updateData = { deleted: true };

        if (updateData.version !== version) {
            const error = new OptimisticLockError();
            throw error;
        }

        updateData.version = parseInt(version, 10) + 1;
        
        return models.Users.update(updateData, { where: whereCondition }).then(result => {
            if (result < 0) {
                const message = stringResources.error.user.updateDelete;
                const error = new UserUpdateError(stringUtils.format(message, userId));
                error.statusCode = 400;
                throw error;
            }

            const message = stringResources.user.deleteSuccess;
            const response = SuccessResponse.getSuccessResponse(200, stringUtils.format(message, userId));
            return Promise.resolve(response);
        });
    });
}

module.exports = deleteUser;
