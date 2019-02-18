const express = require("express");
const users = require("../logic/users/users");
const router = express.Router();

/**
 *
 * TODO: Need some comments here
 */
router.post("/addStudentUser", function(req, res, next) {
  let username = req.query.username;
  let password = req.query.password;
  let email = req.query.email;
  let id = req.query.student_id;
  users.insertStudentUser(username, password, email, id).then(function(val) {
    console.log(val);
    res.send(val);
  });
});

/**
 *
 * @api {get} /getCompletedCourses
 * @apiDescription This endpoint will return user (student) completed courses
 * @apiParam (query) {Integer} studentID
 * @apiExample {curl} Example usage:
 * 		curl -X GET -H "Content-Type: application/json" 'http://localhost:3000/users/getCompletedCourses?studentID=12345'
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

module.exports = router;
