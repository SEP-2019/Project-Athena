const express = require("express");
const courses = require("../logic/courses/courses");
const router = express.Router();
let customResponse = require("../validation/customResponse");
let asyncMiddleware = require("./errorHandlingMiddleware");

/**
 * @api {get} /getCourseByTag
 * @apiDescription get list of courses that match a tag with their description and whether they are desired by the student
 * @apiParam (query) {string} tag, {int} studentID
 * @apiExample {curl} Example usage: GET /courses/getCourseByTag?tag=engineering&studentID=2
 * @returns a list of JSON object [{"course_code": "CCOM 206","desired": 0,"description": null,"title": "Communication in Engineering"},{"course_code": "CIVE 281","desired": 1,"description": null,"title": "Analytical Mechanics"}]
 * @author: Alex Lam, Feras Al Taha
 */
router.get(
  "/getCourseByTag",
  asyncMiddleware(async function(req, res, next) {
    let tag = req.query.tag;
    let studentID = req.query.studentID;
    let result = await courses.getCourseByTag(tag, studentID);
    res.send(customResponse(result));
  })
);

/*
* @api {post} /createCourse
* @apiDescription This endpoint will add a course
* @apiParam (body) {string} courseCode, {string} title, {string} departement, {string} phasedOut
* @apiExample {curl} Example usage:
* Http: 
	POST /courses/createCourse HTTP/1.1
	Host: localhost:3001
	Content-Type: application/json
	{
    "courseCode": "ECSE 428",
    "title": "Software Engineering Practice",
    "departement": "ECSE",
    "phasedOut": "0",
    "description": "Practice in software",
    "credits": 3
  }
* Curl:
	curl -X POST \
	http://localhost:3001/courses/createCourse\
	-H 'Content-Type: application/json' \
	-d '{
    "courseCode": "ECSE 428",
    "title": "Software Engineering Practice",
    "departement" : "ECSE",
    "phasedOut" : "0",
    "description" : "Practice in software",
    "credits": 3
  }'
*
* @returns true if course was added successfully or false otherwise
*
* @author: Mathieu Savoie
*/
router.post(
  "/createCourse",
  asyncMiddleware(async function(req, res, next) {
    const courseCode = req.body.courseCode;
    const title = req.body.title;
    const departement = req.body.departement;
    const phasedOut = req.body.phasedOut;
    const description = req.body.description;
    const credits = req.body.credits;
    let result = await courses.addCourse(
      courseCode,
      title,
      departement,
      phasedOut,
      description,
      credits
    );
    res.send(customResponse(result));
  })
);

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
 *          Invalid course format if the course format is not valid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post(
  "/addCompletedCourses",
  asyncMiddleware(async (req, res, next) => {
    let studentId = req.body.student_id;

    let result = await courses.addCompletedCourses(studentId, req.body.courses);
    res.send(customResponse(result));
  })
);

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
 *         "ECSE 428": [{"id": 253, "semester": "W2017", "section": 1, "scheduled_time": "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05" }],
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
 *          Invalid course format if the course format is not valid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post(
  "/addCourseOfferings",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.addCourseOfferings(req.body.courses);
    res.send(customResponse(result));
  })
);

/**
 * @api {get} /getAllCourses
 * @apiDescription gets all courses stored within the database
 * @apiExample {curl} Example usage: GET /courses/getAllCourses
 * @author: Steven Li
 */
router.get(
  "/getAllCourses",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.getAllCourses();
    res.send(customResponse(result));
  })
);

/**
 * @api {get} /getAllCourseOfferings
 * @apiDescription gets all course offerings stored within the database
 * @apiExample {curl} Example usage: GET /courses/getAllCourseOfferings
 * @author: Steven Li
 */
router.get(
  "/getAllCourseOfferings",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.getAllCourseOfferings();
    res.send(customResponse(result));
  })
);

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
 *         "ECSE 428": ["ECSE 321"],
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
router.post(
  "/addCoreq",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.addCoreq(req.body.coreq);
    res.send(customResponse(result));
  })
);

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
 *         "ECSE 428": ["ECSE 321"],
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
 *          Invalid prereq course format if the prereq format is invalid
 *          database connection handling
 *
 * @author: Steven Li
 */
router.post(
  "/addPrereq",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.addPrereq(req.body.prereq);
    res.send(customResponse(result));
  })
);

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
router.post(
  "/updateCourse",
  asyncMiddleware(async (req, res, next) => {
    let course = req.body.course;
    let newTitle = req.body.new_title;

    let result = await courses.updateCourse(
      course,
      newTitle,
      req.body.new_tags
    );
    res.send(customResponse(result));
  })
);

/**
 * @api {post} /phaseOutCourse
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
router.post(
  "/phaseOutCourse",
  asyncMiddleware(async (req, res, next) => {
    let result = await courses.phaseOutCourse(req.body.course_code);
    res.send(customResponse(result));
  })
);

/**
 *
 * @api {post} /assignCourseToCurriculum
 * @apiDescription assign a course to a courseType (core, techComp, complementaries)
 * @apiParam (body) {string} courseType, {string} courseCode, {string} curriculum
 * @apiExample {curl} Example usage:
 *	curl -X POST \
 *  -H 'Content-Type: application/json' \
 *  -d '{"courseType": "core", "courseCode": "ECSE 428", "curriculum": "eeElectrical Engineering-2018-2019-8-semester-curriculum"}' \
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
router.post(
  "/assignCourseToCurriculum",
  asyncMiddleware(async (req, res, next) => {
    const courseType = req.body.courseType;
    const courseCode = req.body.courseCode;
    const curriculum = req.body.curriculum;

    let response = await courses.assignCourseToCurriculum(
      courseType,
      courseCode,
      curriculum
    );
    res.send(customResponse(response));
  })
);

/**
 * @api {post} /updateDesiredCourse
 * @apiDescription This endpoint will add future desired courses
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /courses/updateDesiredCourse HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	   {
 *       "student_id": "225058391",
 *       "courses": ["ECSE 321", "ECSE 323"]
 *     }
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/courses/updateDesiredCourse
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *       "student_id": "225058391",
 *       "courses": ["ECSE 321", "ECSE 323"]
 *     }'
 *
 * @returns true if future desired courses were added successfully
 *          false if future desired courses were not added
 *          invalid format future courses if the courses format is invalid
 *          database connection handling
 *
 * @author: Mathieu Savoie
 */
router.post("/updateDesiredCourse", async (req, res, next) => {
  let studentId = req.body.student_id;
  let futureCourses;

  try {
    futureCourses = JSON.parse(JSON.stringify(req.body.courses));
  } catch (error) {
    res.status(500).send("invalid format course code");
    return;
  }

  try {
    let result = await courses.saveUserPreferences(studentId, futureCourses);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
