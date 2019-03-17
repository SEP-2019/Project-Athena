const express = require("express");
const users = require("../logic/users/users");
//const curriculum = require("../logic/courses/curriculum");
const router = express.Router();
let asyncMiddleware = require("./errorHandlingMiddleware");
let customResponse = require("../validation/customResponse");

/**
 * @api {post} /addStudentUser
 * @apiDescription This endpoint will add a student and an associated user
 * @apiParam (body) {string} username, {string} password, {string} email, {int} student_id
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /users/addStudentUser HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	{
 *		"username": "alex1234",
 *		"password": "test1234:",
 *		"email" : "alex@email.com",
 *		"student_id" : 123456789
 *	}
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/users/addStudentUser \
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *		"username": "alex1234",
 *		"password": "test1234:",
 *		"email" : "alex@email.com",
 *		"student_id" : 123456789
 *	}'
 *
 * @returns true if student was added successfully or false if not
 *
 * @author: Steven Li + Alex Lam
 */
router.post(
  "/addStudentUser",
  asyncMiddleware(async function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const id = req.body.student_id;
    let result = await users.insertStudentUser(username, password, email, id);
    res.send(customResponse(result));
  })
);

/**
 * @api {post} /addAdminUser
 * @apiDescription This endpoint will add an admin and an associated user
 * @apiParam (body) {string} username, {string} password, {string} email, {int} admin_id
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /users/addAdminUser HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	{
 *		"username": "administrator",
 *		"password": "passAdmin",
 *		"email" : "test.email@email.com",
 *		"admin_id" : 43925
 *	}
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/users/addAdminUser \
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *		"username": "administrator",
 *		"password": "passAdmin",
 *		"email" : "test.email@email.com",
 *		"admin_id" : 43925
 *	}'
 *
 * @returns true if admin was added successfully or false if not
 *
 * @author: Steven Li
 */
router.post(
  "/addAdminUser",
  asyncMiddleware(async function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const id = req.body.admin_id;
    let result = await users.insertAdminUser(username, password, email, id);
    res.send(customResponse(result));
  })
);

/**
 *
 * @api {get} /getCompletedCourses
 * @apiDescription This endpoint will return user (student) completed courses
 * @apiParam (query) {Integer} studentID
 * @apiExample {curl} Example usage:
 * 		curl -X GET -H "Content-Type: application/json" 'http://localhost:3001/users/getCompletedCourses?studentID=12345'
 *
 * @returns An json of completed course code, e.g [{"course_code":"ECSE 422","semester":"W2019"},{"course_code":"ECSE 428","semester":"F2019"}]
 *
 * @author: Yufei Liu
 *
 */
router.get(
  "/getCompletedCourses",
  asyncMiddleware(async (req, res, next) => {
    const student_id = req.query.studentID;
    const result = await users.getCompletedCourses(student_id);
    return res.send(customResponse(result));
  })
);

/* Retrieve user's username and password and compare to stored values for logging in */
router.post(
  "/login",
  asyncMiddleware(async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (await users.login(username, password)) {
      res.send(customResponse("Authenticated"));
    }
  })
);

/**
 *
 * @api {get} /getStudentData
 * @apiDescription This endpoint will return user (student) completed courses, major and minors
 * @apiParam (query) {Integer} studentID
 * @apiExample {curl} Example usage:
 * 		curl -X GET -H "Content-Type: application/json" 'http://localhost:3000/users/getStudentData?studentID=12345'
 *
 * @returns An json of major, minors, completed courses, incompleted core classes and desired tech comps offered next semester,
 *  e.g {"major":[{"curriculum_name":"eeElectrical Engineering-2018-2019-8-semester-curriculum"}],"minor":[],"completedCourses":[{"course_code":"ECSE 428","semester":"winter"}],"incompletedCore":[{"course_code":"ECSE 202","prereqs":[],"coreqs":[],"semester":""}],"desiredTC":[{"course_code":"ECSE 403","prereqs":[{"prereq_course_code":"ECSE 307"}],"coreqs":[],"semester":""}]}
 *
 * @author: Feras Al Taha
 *
 */
router.get(
  "/getStudentData",
  asyncMiddleware(async (req, res, next) => {
    const student_id = req.query.studentID;
    const result = await users.getStudentData(student_id);
    res.send(customResponse(result));
  })
);

module.exports = router;
