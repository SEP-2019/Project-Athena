const express = require("express");
const courses = require("../logic/courses/courses");
const router = express.Router();
const cors = require("cors");
router.use(cors());

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
};

/**
 * @api {get} /getCourseByTag
 * @apiDescription get list of courses that match a tag
 * @apiParam (query) {string} tag
 * @apiExample {curl} Example usage: GET /courses/getCourseByTag?tag=engineering
 * @author: Alex Lam
 */
router.get("/getCourseByTag", cors(corsOptions), async function(
  req,
  res,
  next
) {
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
router.get("/getAllCourses", cors(corsOptions), async (req, res, next) => {
  try {
    let result = await courses.getAllCourses();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /addCoreq
 * @apiDescription This endpoint will add coreqs
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/addCoreq HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	   {
 *       "coreq": {
 *         "ECSE 428": ["ECSE 321"]
 *         "MATH 270": ["MATH 140", "MATH 200"]
 *       }
 *     }
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/courses/addCoreq
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *       "coreq": {
 *         "ECSE 428": ["ECSE 321"],
 *         "MATH 270": ["MATH 140", "MATH 200"]
 *       }
 *     }'
 *
 * @returns true if courses were added successfully
 *          false if courses were not added
 *          invalid format coreq if the coreq format is invalid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post("/addCoreq", async (req, res, next) => {
  let coreqJSON;
  try {
    coreqJSON = JSON.parse(req.body.coreq);
  } catch (err) {
    res.status(400).send("invalid format coreq");
    return;
  }

  try {
    let result = await courses.addCoreq(coreqJSON);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /addPrereq
 * @apiDescription This endpoint will add prereqs
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/addPrereq HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	   {
 *       "prereq": {
 *         "ECSE 428": ["ECSE 321"]
 *         "MATH 270": ["MATH 140", "MATH 200"]
 *       }
 *     }
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/courses/addPrereq
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *       "prereq": {
 *         "ECSE 428": ["ECSE 321"],
 *         "MATH 270": ["MATH 140", "MATH 200"]
 *       }
 *     }'
 *
 * @returns true if courses were added successfully
 *          false if courses were not added
 *          invalid format prereq if the prereq format is invalid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post("/addPrereq", async (req, res, next) => {
  let prereqJSON;
  try {
    prereqJSON = JSON.parse(req.body.prereq);
  } catch (err) {
    res.status(400).send("invalid format prereq");
    return;
  }

  try {
    let result = await courses.addPrereq(prereqJSON);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /updateCourse
 * @apiDescription This endpoint will update a course title and its
 *                 associate tags
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/updateCourse HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	   {
 *       "course": "ECSE 428",
 *       "new_title": "Software Engineering in Practice",
 *       "new_tags": ["Software", "Engineering"]
 *     }
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/courses/updateCourse
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *       "course": "ECSE 428",
 *       "new_title": "Software Engineering in Practice",
 *       "new_tags": ["Software", "Engineering"]
 *     }'
 *
 * @returns true if courses were added successfully
 *          false if courses were not added
 *          invalid format course code if the course code is invalid
 *          invalid format tags if the list of tags is invalid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post("/updateCourse", async (req, res, next) => {
  let course = req.body.course;
  let newTitle = req.body.new_title;
  let newTagsJSON;
  try {
    newTagsJSON = JSON.parse(req.body.new_tags);
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
    return;
  }

  try {
    let result = await courses.updateCourse(course, newTitle, newTagsJSON);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /phaseOutCourses
 * @apiDescription phases out a current course (no longer offered)
 * @apiExample (http) 
        POST /courses/phaseOutCourse
        Host: localhost:3001
        Content-Type: application/json
        {
          "course_code" : "ECSE 428"
        }
 * @Returns true if successful
 * @throws error if MySQL connection failed
 *         invalid format course code if course code format is incorrect
 * @author: Alex Lam
 */
router.post("/phaseOutCourse", async (req, res, next) => {
  try {
    let result = await courses.phaseOutCourse(req.body.course_code);
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 *
 * @api {post} /assignCourseToCurriculum
 * @apiDescription assign a course to a courseType (core, techComp, complementaries)
 * @apiParam (body) {string} courseType, {string} courseCode, {string} curriculum
 * @apiExample {curl} Example usage:
 *	curl -X POST \
 *  -H 'Content-Type: application/json' \
 *  -d '{"courseType": "core", "courseCode": "ECSE 428", "curriculum": "ee"}' \
 *  http://localhost:3001/courses/assignCourseToCurriculum
 *
 * @returns True on success
 *          invalid courseType
 *          curriculum not exists
 *          course not exists
 *          course already assigned to selected curriculumn
 *
 * @author: Yufei Liu
 *
 */
router.post("/assignCourseToCurriculum", async (req, res) => {
  const courseType = req.body.courseType;
  const courseCode = req.body.courseCode;
  const curriculum = req.body.curriculum;

  try {
    await courses.assignCourseToCurriculum(courseType, courseCode, curriculum);
    res.status(200).send(true);
  } catch (err) {
    if (err.message === "Internal Server Error!\n") {
      res.status(500).send(err.message);
    } else {
      res.status(400).send(err.message);
    }
  }
});

module.exports = router;
