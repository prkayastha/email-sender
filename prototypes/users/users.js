class Users {
	constructor() {
		this.id = 0;
		this.email = null;
		this.username = this.email;
		this.lastSignIn = null;
		this.deleted = false;
		this.active = false;
		this.createdAt = null;
		this.updatedAt = null;
	}

	setData(source) {
		for (const attr in Object.keys(this)) {
			if (!!source[attr]) {
				this.attr = source[attr]
			}
		}
	}
}

module.exports = Users;