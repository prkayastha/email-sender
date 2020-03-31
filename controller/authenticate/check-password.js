'use strict';

const moment = require('moment');

const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];
const models = require('../../models');
const strings = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');
const tokenUtils = require('./token');

const Password = require('../../prototypes/password/password');
const UsernamePasswordNotMatchError = require('../../prototypes/responses/password/username-password-error');

const check = function (username, password) {
    let retrivedUser = null;
    return getUserWithPassword(username).then(user => {
        retrivedUser = user;

        return failedAttempts(user.failedAttempts, user.lastFailedAttempts, user.id);
    }).then(result => {
        if (result) {
            //throw error
            const error = new UsernamePasswordNotMatchError(strings.error.password.accountLocked);
            error.statusCode = 401;
            throw error;
        }

        return Password.compareKey(password, retrivedUser.password);
    }).then(matches => {
        return updateLoginAttempt(retrivedUser, matches);
    }).then(result => {
        return passwordExpire(retrivedUser.createdAt);
    }).then(result => {
        if (result) {
            const error = new UsernamePasswordNotMatchError(strings.error.password.passwordExpireError);
            error.statusCode = 401;
            throw error;
        }
        const payload = {
            id: retrivedUser.id,
            username: retrivedUser.username,
            email: retrivedUser.email,
            createdAt: retrivedUser.createdAt
        };
        const token = tokenUtils.generate(payload);
        return {
            ...payload,
            token: token
        };
    });
}

const getUserWithPassword = function (username) {
    const query = "SELECT `user`.`id`, `user`.`username`, `user`.`email`, `user`.`lastSignIn`, `user`.`active`,\
     `user`.`failedAttempts`, `user`.`lastFailedAttempts`, `password`.`createdAt`,\
     `password`.`password` FROM Passwords `password` INNER JOIN Users `user` ON `password`.`userId` = `user`.`id` WHERE\
      userId =(SELECT id FROM Users `user` WHERE `user`.`username` = :username AND `user`.`deleted` IS FALSE) ORDER BY\
       `password`.`createdAt` DESC LIMIT 1";

    return models.sequelize.query(query, {
        replacements: { username: username },
        type: models.Sequelize.QueryTypes.SELECT
    }).then(rows => {
        if (rows.length < 1) {
            const error = new UsernamePasswordNotMatchError(stringUtils.format(strings.error.user.userNotFoundByUsername, username));
            error.statusCode = 401;
            throw error;
        }
        return Promise.resolve(rows[0]);
    });
}

const updateLastSignIn = function (userId) {
    return models.Users.update({ failedAttempts: 0, lastSignIn: new Date() }, { where: { id: userId } });
}

const passwordExpire = function (passwordCreatedAt) {
    const today = moment();
    const createdAt = moment(passwordCreatedAt);

    const days = today.diff(createdAt, 'days');
    const life = settings.authentication.maxPasswordLife || 0;

    if (life > 0 && days > life) {
        return true;
    }

    return false;
}

const failedAttempts = function (attempts, lastFailedAt, userId) {
    const maxAttempts = settings.authentication.maxFailedAttemp;
    const autoUnlockAfter = settings.authentication.autoUnlockAfter;

    if (maxAttempts < 1) {
        return false;
    }

    if (attempts < maxAttempts) {
        return false;
    }

    const lastFailedMoment = moment(lastFailedAt);
    const nowMomment = moment();
    const diff = nowMomment.diff(lastFailedMoment, 'minutes');

    if (autoUnlockAfter < 1) {
        return true;
    }

    if (diff > autoUnlockAfter) {
        return models.Users.update({ failedAttempts: 0 }, { where: { id: userId } }).then(result => {
            return false;
        });
    }

    return true;

}

const updateLoginAttempt = function (retrivedUser, isAuthenticated) {
    if (isAuthenticated) {
        return updateLastSignIn(retrivedUser.id);
    }

    return models.Users.findOne({
        attributes: ['failedAttempts'],
        where: { id: retrivedUser.id, deleted: false }
    }).then(user => {
        return models.Users.update({
            failedAttempts: (parseInt(user.failedAttempts) + 1),
            lastFailedAttempts: new Date()
        }, { where: { id: retrivedUser.id } })
    }).then(result => {
        const error = new UsernamePasswordNotMatchError(strings.error.password.usernamePasswordNotMatchError);
        error.statusCode = 401;
        throw error;
    });
}

module.exports = check;
