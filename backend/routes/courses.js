const express = require('express');
const courses = require('../logic/courses/courses');
const router = express.Router();

/*
* @api {get} /getCourseByTag
* @apiDescription get list of courses that match a tag
* @apiParam (query) {string} tag
* @apiExample {curl} Example usage: GET /courses/getCourseByTag?tag=engineering
*
* @returns array of course codes corresponding to tags
*
* @author: Alex Lam
*/
router.get('/getCourseByTag', async function (req, res, next) {
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
* @api {get} /createCourse
* @apiDescription This endpoint will add a course and an associated user
* @apiParam (body) {string} courseCode, {string} title, {string} departement
* @apiExample {curl} Example usage:
* Http: 
	POST /users/createCourse HTTP/1.1
	Host: localhost:3000
	Content-Type: application/json
	{
		"courseCode": "ECSE 428",
		"title": "Software Engineering Practice",
		"departement" : "ECSE"
	}
* Curl:
	curl -X POST \
	http://localhost:3000/users/createCourse\
	-H 'Content-Type: application/json' \
	-d '{
		"courseCode": "ECSE 428",
		"title": "Software Engineering Practice",
		"departement" : "ECSE"
	}'
*
* @returns true if course was added successfully or false otherwise
*
* @author: Mathieu Savoie
*/

router.post('/createCourse', function(req, res, next) {
  const courseCode = req.body.courseCode;
  const title = req.body.title;
  const email = req.body.email;
  const departement = req.body.departement;
  users.insertStudentUser(title, email, departement)
    .then(val => {
      res.send(val);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});


module.exports = router;

