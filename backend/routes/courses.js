const express = require('express');
const courses = require('../logic/courses/courses');
const router = express.Router();

/*
 * @api {get} /getCourseByTag
 * @apiDescription get list of courses that match a tag
 * @apiParam (query) {string} tag
 * @apiExample {curl} Example usage: GET /courses/getCourseByTag?tag=engineering
 * @author: Alex Lam
 */
router.get('/getCourseByTag', async function(req, res, next) {
  try {
    let tag = req.query.tag;
    let result = await courses.queryCourseByTag(tag);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

/*
* @api {post} /addCompletedCourses
* @apiDescription This endpoint will add an admin and an associated user
* @apiParam (body) {string} username, {string} password, {string} email, {int} admin_id
* @apiExample {curl} Example usage:
* Http: 
*	POST /courses/addCourses HTTP/1.1
*	Host: localhost:3001
*	Content-Type: application/json
*	    {
*       "courses": {
*         "ECSE 428": [{"semester": "W2017", "section": 1}],
*         "ECSE 356": [{"semester": "S2019", "section": 2}],
*         "ECSE 422": [{"semester": "F2019", "section": 1},
*                      {"semester": "W2018", "section": 3}]
*       },
*       "student_id": 258373829,
*       "section": 1
*     }
* Curl:
*	curl -X POST \
*	http://localhost:3001/courses/addCompletedCourses \
*	-H 'Content-Type: application/json' \
*	-d '{
*       "courses": {
*         "ECSE 428": [{"semester": "W2017", "section": 1}],
*         "ECSE 356": [{"semester": "S2019", "section": 2}],
*         "ECSE 422": [{"semester": "F2019", "section": 1},
*                      {"semester": "W2018", "section": 3}]
*       },
*       "student_id": 258373829,
*       "section": 1
*     }'
*
* @returns true if courses were added successfully
*          false if courses were not added
*          invalid format id if student_id format is not valid
*          invalid format courses if the course format is not valid
*          failed to establish connection with database if connection failed
*
* @author: Steven Li
*/
router.post('/addCompletedCourses', function(req, res, next) {
  let studentId = req.body.student_id;
  let section = req.body.section;
  let coursesJSON;

  try {
    coursesJSON = JSON.parse(req.body.courses);
  } catch (error) {
    res.status(500).send("invalid format courses");
    return;
  }

  courses.addCompletedCourses(studentId, coursesJSON, section)
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send(err.message);
    });
});

module.exports = router;
