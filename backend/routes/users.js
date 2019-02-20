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

module.exports = router;
