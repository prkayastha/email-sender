/**
 * Class for users
 */
class Users {

	/**
	 * initiate instance of user
	 */
	constructor() {
		this.id = 0;
		this.email = null;
		this.username = null;
		this.lastSignIn = null;
		this.deleted = false;
		this.active = false;
		this.createdAt = null;
		this.updatedAt = null;
		this.version = 0;
		this.Roles=[];
	}

	/**
	 * set user information to user object
	 * @param {any} source user informatioin
	 * @param {boolean} seperateUsername boolean value to indicate if system uses email as username
	 */
	setData(source, seperateUsername = false) {
		for (const attr of Object.keys(this)) {
			if (attr!=='password' && !!source[attr]) {
				this[attr] = source[attr];
			}
		}

		if (!seperateUsername) {
			this.username = this.email;
		}
	}
}

module.exports = Users;