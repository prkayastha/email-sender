const messages = {
    user: {
        add: 'User added to the system.',
        confirmEmail: '<p>Welcome to our user management system. You are successfully registered to the system. To activate your account, click on the link below:</p>\
        <p> <a title="activate_link" href="{0}" target="_blank">{0}</p>\
        <p>Thank You</p>\
        <p>Yours Sincere,<br/>The Team</p>',
        activateSuccess: 'User with email {0} activated in the system.',
        deleteSuccess: 'User with id {0} has been deleted from the system',
        updateSuccess: 'User with id {0} has been updated in the system'
    },
    error: {
        user: {
            multipleEmail: 'User exists in the system.',
            usernameUnavailable: 'Username is not available. Please use other username.',
            userNotFoundByEmail: 'Cannot find user registered to our system with email \'{0}\'',
            userNotFoundById: 'Cannot find user registered to our system with id {0}',
            updateActivation: 'Cannot activate user with email \'{0}\'',
            updateDelete: 'Cannot delete user with id {0}',
            updateFailure: 'Cannot update user with id {0}'
        } 
    }
}

module.exports = messages;
