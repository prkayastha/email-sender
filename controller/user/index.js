const add = require('./add');
const activate = require('./activate');
const deleteUser = require('./delete');
const list = require('./list');
const get = require('./get-user');
const update = require('./update');
const changePassword = require('../authenticate/changePassword');

module.exports = {
    add,
    activate,
    deleteUser,
    list,
    get,
    update,
    changePassword
};
