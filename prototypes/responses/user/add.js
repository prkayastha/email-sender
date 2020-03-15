const SuccessResponse = require('../global.success');
const User = require('../../users/users');

/**
 * Class for success response of user creation
 */
class UserAddSuccessResponse extends SuccessResponse {
    /**
     * initialize success response of user creation
     */
    constructor() {
        super();
        this.user = null;
    }

    /**
     * set user returned after creation
     * @param {User} user user returned after creation
     */
    setUser(user) {
        this.user = user
    }
}

module.exports = UserAddSuccessResponse;
