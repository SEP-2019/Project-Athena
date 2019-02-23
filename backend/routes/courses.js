const express = require('express');
const courses = require('../logic/courses/courses');
const router = express.Router();
var customResponse = require('../validation/customResponse')

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
router.get('/getCourseByTag', asyncMiddleware(async function (req, res, next) {
    let tag = req.query.tag;
    let result = await courses.queryCourseByTag(tag);
    res.send(customResponse(result));

}));

module.exports = router;