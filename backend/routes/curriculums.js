const express = require("express");
const curriculums = require("../logic/curriculums/curriculums");
const router = express.Router();

/**
 * @api {post} /createCurriculum
 * @apiDescription This endpoint will add a student and an associated user
 * @apiParam (body) {string} username, {string} password, {string} email, {int} student_id
 * @apiExample {curl} Example usage:
 * Http:
 *	POST /users/createCurriculum HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	{
 *		"name": "Electrical Engineering 2017-2018 7 Semesters",
 *		"type": "Major",
 *		"department" : "Electrical Engineering",
 *		"numOfElectives" : 2,
 *      "cores" : ["ECSE 200", "COMP 202", "MATH 262", "MATH 263"],
 *      "techComps" : ["ECSE 415", "ECSE 432", "ECSE 427"],
 *      "comps" : ["MATH 338", "ANTH 212"]
 *	}
 * Curl:
 *	curl -X POST \
 *	http://localhost:3001/users/createCurriculum \
 *	-H 'Content-Type: application/json' \
 *	-d '{
 *		"name": "Electrical Engineering 2017-2018 7 Semesters",
 *		"type": "Major",
 *		"department" : "Electrical Engineering",
 *		"numOfElectives" : 2,
 *      "cores" : ["ECSE 200", "COMP 202", "MATH 262", "MATH 263"],
 *      "techComps" : ["ECSE 415", "ECSE 432", "ECSE 427"],
 *      "comps" : ["MATH 338", "ANTH 212"]
 *	}'
 *
 * @returns true if student was added successfully or false if not
 *
 * @author: Gareth Peters
 */
router.post("/createCurriculum", function(req, res) {
	const name = req.body.name;
	const type = req.body.type;
	const department = req.body.department;
	const numOfElectives = req.body.numOfElectives;
	const cores = req.body.core;
    const techComps = req.body.techComps;
    const comps = req.body.comps;
	curriculums
		.createCurriculum(name, type, department, numOfElectives, cores, techComps, comps)
		.then(val => {
		res.send(val);
		})
		.catch(err => {
		res.status(500).send(err.message);
		});
  });

  module.exports = router;