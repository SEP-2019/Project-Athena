const express = require("express");
const users = require("../logic/users/users");
//const curriculum = require("../logic/courses/curriculum");
const router = express.Router();
<<<<<<< HEAD
const app = require("../app.js");
=======
const app = require("../app.js")
>>>>>>> Some changes to accessibility of passport from other files

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
router.post("/addStudentUser", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const id = req.body.student_id;
  users
    .insertStudentUser(username, password, email, id)
    .then(val => {
      res.send(val);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

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
router.post("/addAdminUser", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const id = req.body.admin_id;
  users
    .insertAdminUser(username, password, email, id)
    .then(val => {
      res.send(val);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

/*Receive the User's completed Courses and compare them to curriculum*/
router.post("/completedCourses/comparison", function(req, res) {
  let completedCourses = req.body;
  curriculum
    .courseComparison(completedCourses)
    .then(function(remainingCourses) {
      res.send(remainingCourses);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error comparing completed courses and curriculum");
    });
});

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
router.get("/getCompletedCourses", async (req, res) => {
  const student_id = req.query.studentID;
  const courses = await users.getCompletedCourses(student_id);
  res.status(200).send(courses);
});

<<<<<<< HEAD
/* Retrieve user's username and password and compare to stored values for logging in */
router.post('/login', app.passport.authenticate('local-signin',  {/*Subject to change later*/}));
=======
router.post('/login', app.passport.authenticate('local-signin',  { successRedirect: '/dashboard',
                                                          failureRedirect: '/signin'}
                                                          ));
>>>>>>> Some changes to accessibility of passport from other files



module.exports = router;
