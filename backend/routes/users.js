const express = require("express");
const users = require("../logic/users/users");
//const curriculum = require("../logic/courses/curriculum");
const router = express.Router();

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
 * @returns An json of completed course code, e.g [{"course_code":"ECSE 422","semester":"W2019"},{"course_code":"ECSE 428","semester":"F2019"}]
 *
 * @author: Yufei Liu
 *
 */
router.get("/getCompletedCourses", async (req, res) => {
  const student_id = req.query.studentID;
  const result = await users.getCompletedCourses(student_id);
  if (result === "No student ID found!") {
    return res.status(400).send(result);
  } else if (result === "Interval serever error!") {
    return res.status(500).send(result);
  }
  return res.status(200).send(result);
});

/* Retrieve user's username and password and compare to stored values for logging in */
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (await users.login(username, password)) {
      res.status(200).send("Authenticated");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 *
 * @api {get} /getStudentData
 * @apiDescription This endpoint will return user (student) completed courses, major and minors
 * @apiParam (query) {Integer} studentID
 * @apiExample {curl} Example usage:
 * 		curl -X GET -H "Content-Type: application/json" 'http://localhost:3000/users/getStudentData?studentID=12345'
 *
 * @returns An json of current major & minors, and completed course code, e.g {"major":"Electrical Major","minor":"Software Minor","courses":[{"course_code":"ECSE422","semester":"W2019"},{"course_code":"ECSE428","semester":"F2019"}]}
 *
 * @author: Feras Al Taha
 *
 */
router.get("/getStudentData", async (req, res) => {
  const student_id = req.query.studentID;
  try {
    const data = await users.getStudentData(student_id);
    res.status(200).send(data);
  } catch (error) {
    //for now just send back generic 500, will have to edit later on to return specific error codes based on what happened
    res.status(500).send(error.message);
  }
});

/**
 *
 * @api {post} /assignStudentMajor
 * @apiDescription assign or update a Major curriculum to a student
 * @apiParam (body) {Integer} studentID, {string} major
 * @apiExample {curl} Example usage:
 *	curl -X POST \
 *  -H 'Content-Type: application/json' \
 *  -d '{"studentID": 260678788, "major": "Electrical Engineering"}' \
 *  http://localhost:3001/courses/assignStudentMajor
 *
 * @returns True on success
 *          invalid student ID
 *          invalid curriculum name
 *          student does not exist
 *          curriculum does not exist
 *          student already assigned major
 *
 * @author: Gareth Peters
 *
 */

router.post("/assignStudentMajor", async (req, res) => {
  const studentID = req.query.studentID;
  const major = req.query.major;
  try {
    await users.assignStudentMajor(studentID, major);
    res.status(200).send(true);
  } catch (error) {
    if (err.message === "Internal Server Error!\n") {
      res.status(500).send(err.message);
    } else {
      res.status(400).send(err.message);
    }
  }
});

/**
 *
 * @api {post} /assignStudentMinor
 * @apiDescription assign or update a Minor curriculum to a student
 * @apiParam (body) {Integer} studentID, {string} minor
 * @apiExample {curl} Example usage:
 *	curl -X POST \
 *  -H 'Content-Type: application/json' \
 *  -d '{"studentID": 260678788, "minor": "Software Engineering"}' \
 *  http://localhost:3001/courses/assignStudentMinor
 *
 * @returns True on success
 *          invalid student ID
 *          invalid curriculum name
 *          student does not exist
 *          curriculum does not exist
 *          student already assigned minor
 *
 * @author: Gareth Peters
 *
 */

router.post("/assignStudentMinor", async (req, res) => {
  const studentID = req.query.studentID;
  const minor = req.query.minor;
  try {
    await users.assignStudentMinor(studentID, minor);
    res.status(200).send(true);
  } catch (error) {
    if (err.message === "Internal Server Error!\n") {
      res.status(500).send(err.message);
    } else {
      res.status(400).send(err.message);
    }
  }
});

module.exports = router;
