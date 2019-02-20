const express = require('express');
const users = require('../logic/users/users');
const router = express.Router();

/*
* @api {get} /getCompletedCourses
* @apiDescription This endpoint will add a student and an associated user
* @apiParam (body) {string} username, {string} password, {string} email, {int} student_id
* @apiExample {curl} Example usage:
* Http: 
	POST /users/addStudentUser HTTP/1.1
	Host: localhost:3000
	Content-Type: application/json
	{
		"username": "alex1234",
		"password": "test1234:",
		"email" : "alex@email.com",
		"student_id" : 123456789
	}
* Curl:
	curl -X POST \
	http://localhost:3000/users/addStudentUser \
	-H 'Content-Type: application/json' \
	-d '{
		"username": "alex1234",
		"password": "test1234:",
		"email" : "alex@email.com",
		"student_id" : 123456789
	}'
*
* @returns true if student was added successfully or false if not
*
* @author: Steven Li + Alex Lam
*/
router.post('/addStudentUser', function (req, res, next) {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let id = req.body.student_id;
	users.insertStudentUser(username, password, email, id)
		.then(function (val) {
			console.log(val);
			res.send(val);
		});
});

module.exports = router;