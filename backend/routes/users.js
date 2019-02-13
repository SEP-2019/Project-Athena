var express = require('express');
var users = require('../logic/users/users');
var router = express.Router();

/* GET users listing. */
router.post('/addStudentUser', function(req, res, next) {
	var username = req.query.username;
	var password = req.query.password;
	var email = req.query.email;
	var id = req.query.student_id;
	users.insertStudentUser(username, password, email, id)
	.then(function(val) {
		console.log(val);
		res.send(val);
	});
});

module.exports = router;
