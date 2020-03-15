const messages = {
    user: {
        add: 'User added to the system.',
        confirmEmail: '<p>Welcome to our user management system. You are successfully registered to the system. To activate your account, click on the link below:</p>\
        <p> <a title="activate_link" href="{0}" target="_blank">{0}</p>\
        <p>Thank You</p>\
        <p>Yours Sincere,<br/>The Team</p>'
    },
    error: {
        user: {
            multipleEmail: 'User exists in the system.',
            usernameUnavailable: 'Username is not available. Please use other username.'
        } 
    }
}

module.exports = messages;
