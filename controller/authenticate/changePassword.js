const ChangePassword = require('../../prototypes/password/changePassword');

const models = require('../../models');
const strings = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');
const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];

const Password = require('../../prototypes/password/password');
const PasswordNotMatch = require('../../prototypes/responses/password/password-not-match');
const PasswordRepeat = require('../../prototypes/responses/password/repeat-password');
const SuccessResponse = require('../../prototypes/responses/global.success');

/**
 * function to update password
 * @param {ChangePassword} changePassword 
 */
const change = function (changePassword) {
    const history = +settings.authentication.preventPasswordHistory;
    const re = new RegExp(changePassword.password);
    let passwordToStore = null;

    if (!re.test(changePassword.confirmPassword)) {
        //passwords do not match throw error
        const error = new PasswordNotMatch(strings.error.password.confirmationError);
        return Promise.reject(error);
    }

    return Password.setPassword(changePassword.id, changePassword.password).then(password => {
        passwordToStore = password;
        return checkHistory(passwordToStore.UserId, passwordToStore.password);
    }).then(isInHistory => {
        if (isInHistory) {
            const message = stringUtils.format(strings.error.password.passwordRepeatError, history);
            const error = new PasswordRepeat(message);
            throw error;
        }
        return models.Password.create(passwordToStore);
    }).then(result => {
        const response = SuccessResponse.getSuccessResponse(200, strings.password.changeSuccess);
        return response;
    });
};

const checkHistory = function (userId, password) {
    const history = +settings.authentication.preventPasswordHistory;

    if (history < 1) {
        return Promise.resolve(false);
    }

    return models.Password.findAll({
        where: { userId: userId },
        limit: history,
        order: [['createdAt', 'DESC']]
    }).then(history => {
        const passwordHistory = history.map(eachHistory => eachHistory.password);

        if (passwordHistory.includes(password)) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    });
}

module.exports = change;
