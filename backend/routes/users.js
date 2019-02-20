const express = require("express");
const users = require("../logic/users/users");
const curriculum = require("../logic/courses/curriculum");
const router = express.Router();

/* GET users listing. */
router.post("/addStudentUser", function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let id = req.body.student_id;
  users.insertStudentUser(username, password, email, id).then(function(val) {
    res.send(val);
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
