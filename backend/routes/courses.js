const express = require('express');
const courses = require('../logic/courses/courses');
const router = express.Router();

/*
* @api {get} /getCourseByTag
* @apiDescription 
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

module.exports = router;