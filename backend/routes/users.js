const express = require('express');
const users = require('../logic/users/users');
const router = express.Router();

/* GET users listing. */
router.post('/addStudentUser', function(req, res, next) {
	let username = req.query.username;
	let password = req.query.password;
	let email = req.query.email;
	let id = req.query.student_id;
	users.insertStudentUser(username, password, email, id)
	.then(function(val) {
		console.log(val);
		res.send(val);
	});
});

module.exports = router;
