const express = require("express");
const curriculums = require("../logic/curriculums/curriculums");
const router = express.Router();
let customResponse = require("../validation/customResponse");
let asyncMiddleware = require("./errorHandlingMiddleware");

/**
 * @api{get} /getAllCurriculumNames
 * @apiDescription gets a list of all curriculum names
 * @apiExample {curl} Example usage: GET /curriculums/getAllCurriculumNames
 * @author Patrick Lai
 * @returns :
 * {
 * }
 */
router.get("/getAllCurriculumNames", async (req, res, next) => {
  try {
    let result = await curriculums.getAllCurriculumNames();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {get} /getCurriculum
 * @apiDescription gets a curriculum's courses from its name
 * @apiExample {curl} Example usage: GET /curriculums/getCurriculum?name=...
 * @author Feras Al Taha and Alex Lam
 * @Returns :
 *    {
 *        "curriculum_name": "eeElectrical Engineering-2018-2019-8-semester-curriculum",
 *        "type": "8-semester-curriculum",
 *        "department": "ee",
 *        "numOfElectives": 0,
 *        "core_classes": [{course_code: "exm 123"}, {"course_code": "exm 456"}, ..],
 *        "tech_comps": [...],
 *        "complementaries": [...]
 *    }
 */
router.get(
  "/getCurriculum",
  asyncMiddleware(async (req, res, next) => {
    const name = unescape(req.query.name);
    console.log(name);
    let result = await curriculums.getCurriculum(name);
    res.send(customResponse(result));
  })
);

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
router.post(
  "/createCurriculum",
  asyncMiddleware(async function(req, res, next) {
    const name = req.body.name;
    const type = req.body.type;
    const department = req.body.department;
    const numOfElectives = req.body.numOfElectives;
    const cores = req.body.cores;
    const techComps = req.body.techComps;
    const comps = req.body.comps;
    let result = await curriculums.createCurriculum(name, type, department, numOfElectives, cores, techComps, comps);
    res.send(customResponse(result));
  })
);

router.get(
  "/getCurriculumYears",
  asyncMiddleware(async function(req, res, next) {
    let result = await curriculums.getCurriculumYears();
    res.send(customResponse(result));
  })
);

module.exports = router;
