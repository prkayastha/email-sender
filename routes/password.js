'use strict';

var express = require('express');
var router = express.Router();

const env = process.env.NODE_ENV || 'development';

const userOperation = require('../controller/user');
const ChangePassword = require('../prototypes/password/changePassword');

const errorHandler = require('../controller/errorHandler');

router.post('/change', function(req, res){

    const changePassword = new ChangePassword(req.body);

    userOperation.changePassword(changePassword).then(response => {
        res.send(response);
    }).catch(error => {
        errorHandler(res, error);
    });
    
});

module.exports = router;