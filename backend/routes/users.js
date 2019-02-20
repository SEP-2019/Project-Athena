const express = require('express');
const users = require('../logic/users/users');
const router = express.Router();

/* GET users listing. */
router.post('/addStudentUser', function(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let id = req.body.student_id;
	users.insertStudentUser(username, password, email, id)
	.then(function(val) {
		console.log(val);
		res.send(val);
	});
});

module.exports = router;
