const express = require("express");
const courses = require("../logic/courses/courses");
const router = express.Router();

/**
 * @api {get} /getCourseByTag
 * @apiDescription get list of courses that match a tag
 * @apiParam (query) {string} tag
 * @apiExample {curl} Example usage: GET /courses/getCourseByTag?tag=engineering
 * @author: Alex Lam
 */
router.get("/getCourseByTag", async function(req, res, next) {
  try {
    let tag = req.query.tag;
    let result = await courses.queryCourseByTag(tag);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

/**
 * @api {post} /addCompletedCourses
 * @apiDescription This endpoint will add a student's completed courses
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/addCompletedCourses HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	    {
 *       "courses": {
 *         "ECSE 428": [{"semester": "W2017", "section": 1}],
 *         "ECSE 356": [{"semester": "S2019", "section": 2}],
 *         "ECSE 422": [{"semester": "F2019", "section": 1},
 *                      {"semester": "W2018", "section": 3}]
 *       },
 *       "student_id": 258373829
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
 *       "student_id": 258373829
 *     }'
 *
 * @returns true if courses were added successfully
 *          false if courses were not added
 *          invalid format id if student_id format is not valid
 *          invalid format courses if the course format is not valid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post("/addCompletedCourses", async (req, res, next) => {
  let studentId = req.body.student_id;
  let coursesJSON;

  try {
    coursesJSON = JSON.parse(req.body.courses);
  } catch (error) {
    res.status(500).send("invalid format courses");
    return;
  }

  try {
    let result = await courses.addCompletedCourses(studentId, coursesJSON);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /addCourseOfferings
 * @apiDescription This endpoint will add courses offered to the database
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/addCourseOfferings HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	   {
 *       "courses": {
 *         "ECSE 428": [{"id": 253, "semester": "W2017", "section": 1, "scheduled_time": "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05", }]
 *         "ECSE 356": [{"id": 2758, "semester": "S2019", "section": 2, "scheduled_time": "W 10:05-13:05 W 16:05-17:05"}],
 *         "ECSE 422": [{"id": 25993, "semester": "F2019", "section": 1, "scheduled_time": "M 8:35-10:05 W 8:35-10:05"},
 *                      {"id": 25993, "semester": "W2018", "section": 3, "scheduled_time": "M 10:05-11:05 W 10:05-11:05 T 10:05-11:05"}]
 *       }
 *     }
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/courses/addCourseOfferings
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *       "courses": {
 *         "ECSE 428": [{"id": 253, "semester": "W2017", "section": 1, "scheduled_time": "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05", }]
 *         "ECSE 356": [{"id": 2758, "semester": "S2019", "section": 2, "scheduled_time": "W 10:05-13:05 W 16:05-17:05"}],
 *         "ECSE 422": [{"id": 25993, "semester": "F2019", "section": 1, "scheduled_time": "M 8:35-10:05 W 8:35-10:05"},
 *                      {"id": 25993, "semester": "W2018", "section": 3, "scheduled_time": "M 10:05-11:05 W 10:05-11:05 T 10:05-11:05"}]
 *       }
 *     }'
 *
 * @returns true if courses were added successfully
 *          false if courses were not added
 *          invalid format id if student_id format is not valid
 *          invalid format courses if the course format is not valid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post("/addCourseOfferings", async (req, res, next) => {
  let coursesJSON;
  try {
    coursesJSON = JSON.parse(req.body.courses);
  } catch (error) {
    res.status(500).send("invalid format courses");
    return;
  }

  try {
    let result = await courses.addCourseOfferings(coursesJSON);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/**
 * @api {get} /getAllCourses
 * @apiDescription gets all courses stored within the database
 * @apiExample {curl} Example usage: GET /courses/getAllCourses
 * @author: Steven Li
 */
router.get("/getAllCourses", async (req, res, next) => {
  try {
    let result = await courses.getAllCourses();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
