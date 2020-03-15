var express = require('express');
var router = express.Router();

const userOperation = require('../controller/user');
const User = require('../prototypes/users/users');

/* GET users listing. */
router.get('/add', function (req, res) {
  const user = new User();
  user.setData(req.body);
  userOperation.add(user).then(userResponse => {
    res.send(userResponse);
  });
});

module.exports = router;
