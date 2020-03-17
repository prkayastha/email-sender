'use strict';

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const env = process.env.NODE_ENV || 'development';
const settings = require('../../config/settings.json')[env];

const models = require('../../models');

const successResponse = require('../../prototypes/responses/user/add');
const UserAddError = require('../../prototypes/responses/user/error.add');
const messages = require('../../resources/string/resources');
const stringUtils = require('../../utils/string-formatter');

/**
 * add the use to the Users table
 * @param {User} user User object to be inserted into user table
 */
const add = function (user) {
    const isSendEmail = settings.sendConfirmationEmail || false;
    return checkUnique(user.email, user.username).then(result => {
        if (result) {
            return models.Users.create(user).then(user => {
                const response = successResponse.getSuccessResponse(200, messages.user.add);
                response.user = user;
                if (isSendEmail) {
                    sendConfirmationEmail(user);
                }
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

/**
 * function to send confirmation email to recently created user
 * @param {Object} createdUser created user object
 */
const sendConfirmationEmail = function (createdUser) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: settings.senderEmail
    });

    let body = messages.user.confirmEmail;
    const generatedHashString = generateHash(createdUser.createdAt, createdUser.email);
    const confirmationLink = `${settings.apiURL}/${generatedHashString}?email=${createdUser.email}`
    body = stringUtils.format(body, confirmationLink);

    transporter.sendMail(
        {
            from: settings.senderEmail.user,
            to: createdUser.email,
            subject: 'Confirmation',
            html: body
        },
        function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        }
    );
}

/**
 * function to generate hash for activating the user
 * @param {DateTime} createdAt DateTime when the user was created
 * @param {string} email email of the user
 */
const generateHash = function (createdAt, email) {
    const createdDate = (new Date(createdAt)).valueOf().toString();
    const stringToHash = createdDate+email;
    return crypto.createHash('sha256').update(stringToHash).digest('hex')
}

module.exports = add;
