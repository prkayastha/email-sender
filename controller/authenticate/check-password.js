'use strict';

const models = require('../../models');
const strings = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');
const token = require('./token');

const Password = require('../../prototypes/password/password');
const UsernamePasswordNotMatchError = require('../../prototypes/responses/password/username-password-error');

const check = function (username, password) {
    let retrivedUser = null;
    return getUserWithPassword(username).then(user => {
        retrivedUser = user;
        return Password.compareKey(password, user.password);
    }).then(matches => {
        if(!matches) {
            const error = new UsernamePasswordNotMatchError(strings.error.password.usernamePasswordNotMatchError);
            error.statusCode = 401;
            throw error;
        }
        const payload = {
            id: retrivedUser.id,
            username: retrivedUser.username,
            email: retrivedUser.email,
            createdAt: retrivedUser.createdAt
        };
        const token = token.generate(payload);
        return {
            ...payload,
            token: token
        };
    });
}

const getUserWithPassword = function(username) {
    const query = "SELECT `user`.`id`, `user`.`username`, `user`.`email`, `user`.`lastSignIn`, `password`.`createdAt`,\
     `password`.`password` FROM Passwords `password` INNER JOIN Users `user` ON `password`.`userId` = `user`.`id` WHERE\
      userId =(SELECT id FROM Users `user` WHERE `user`.`username` = ':username' AND `user`.`deleted` IS FALSE) ORDER BY\
       `password`.`createdAt` DESC LIMIT 1";

    return models.sequelize.query(query, {
        replacements: { username: username },
        type: models.Sequelize.QueryTypes
    }).then(rows => {
        if (rows.length < 1) {
            const error = new UsernamePasswordNotMatchError(stringUtils.format(strings.error.user.userNotFoundByUsername, username));
            error.statusCode = 401;
            throw error;
        }
        return Promise.resolve(rows[0]);
    });
}

module.exports = check;
