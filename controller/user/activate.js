const models = require('../../models');
const hashUtils = require('../../utils/hashUtils');
const UserNotFoundError = require('../../prototypes/responses/user/error.user.not.found');
const UserUpdateError = require('../../prototypes/responses/user/error.update');
const SuccessResponse = require('../../prototypes/responses/global.success');
const stringResources = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

/**
 * function to activate the email
 * @param {string} hash hash string to be compared
 * @param {string} userEmail user email to be compared for
 */
const activate = function (hash, userEmail, version) {
    const whereCondition = {
        email: userEmail,
        deleted: false
    };
    return models.Users.findOne({ where: whereCondition }).then(user => {
        const matches = hashUtils.compareHash(hash, user);
        if (!matches)
         {
            const message = stringResources.error.user.userNotFoundByEmail;
            const error = new UserNotFoundError(stringUtils.format(message, userEmail));
            error.statusCode = 400;
            throw error;
        }

        const updateData = { active: true };

        if (updateData.version !== version) {
            const error = new OptimisticLockError();
            throw error;
        }

        updateData.version = parseInt(version, 10) + 1;

        return models.Users.update(updateData, { where: whereCondition }).then(result => {
            if (result < 0) {
                const message = stringResources.error.user.updateActivation;
                const error = new UserUpdateError(stringUtils.format(message, userEmail));
                error.statusCode = 400;
                throw error;
            }

            const message = stringResources.user.activateSuccess;
            const response = SuccessResponse.getSuccessResponse(200, stringUtils.format(message, userEmail));
            return Promise.resolve(response);
        });
    });
}

module.exports = activate;