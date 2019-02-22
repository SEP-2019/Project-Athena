const express = require("express");
const users = require("../logic/users/users");
//const curriculum = require("../logic/courses/curriculum");
const router = express.Router();
const asyncMiddleware = require('../routes/errorHandlingMiddleware');
var customResponse = require('../validation/customResponse')

/**
* @api {get} /addStudentUser
* @apiDescription This endpoint will add a student and an associated user
* @apiParam (body) {string} username, {string} password, {string} email, {int} student_id
* @apiExample {curl} Example usage:
* Http: 
	POST /users/addStudentUser HTTP/1.1
	Host: localhost:3001
	Content-Type: application/json
	{
		"username": "alex1234",
		"password": "test1234:",
		"email" : "alex@email.com",
		"student_id" : 123456789
	}
*
* @returns true if student was added successfully or an error if not
*
* @author: Steven Li + Alex Lam
*/
router.post('/addStudentUser',asyncMiddleware(async function (req, res, next) {
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let id = req.body.student_id;
	let result = await users.insertStudentUser(username, password, email, id)
	res.send(customResponse(result, null));
}));

/**
 *
 * @api {get} /getCompletedCourses
 * @apiDescription This endpoint will return user (student) completed courses
 * @apiParam (query) {Integer} studentID
 * @apiExample {curl} Example usage:
 * 		curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/users/getCompletedCourses?studentID=12345'
 *
 * @returns An json of completed course code, e.g [{"course_code":"ECSE422","semester":"W2019"},{"course_code":"ECSE428","semester":"F2019"}]
 *
 * @author: Yufei Liu
 *
 */
router.get("/getCompletedCourses", asyncMiddleware(async (req, res) => {
  const student_id = req.query.studentID;
  const courses = await users.getCompletedCourses(student_id);
  res.status(200).send(customResponse(courses, null));
}));

module.exports = router;
