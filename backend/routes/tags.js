const express = require("express");
const tags = require("../logic/tags/tags");
const router = express.Router();

/**
 * @api {get} /getAllTags
 * @apiDescription gets a list of tags
 * @apiExample {curl} Example usage: GET /tags/getAllTags
 * @author: Steven Li
 */
router.get("/getAllTags", async function (req, res, next) {
  try {
    let result = await tags.getAllTags();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

/**
 * @api {post} /createTag
 * @apiDescription creates a tag
 * @apiExample {curl} Example usage: 
 * Http:
 *	POST /tags/createTag HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	    {
 *        "tag": "Engineering"
 *      }
 * Curl:
 *	curl -X POST
 *	http://localhost:3001/tags/createTag
 *	-H 'Content-Type: application/json'
 *	-d '{
 *       "tag": "Engineering"
 *      }'
 * @author: Steven Li
 */
router.post("/createTag", async function (req, res, next) {
  let tag = req.body.tag;

  try {
    let result = await tags.addTag(tag);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /deleteTag
 * @apiDescription deletes a tag
 * @apiExample {curl} Example usage: 
 * Http:
 *	POST /tags/deleteTag HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	    {
 *        "tag": "Engineering"
 *      }
 * Curl:
 *	curl -X POST
 *	http://localhost:3001/tags/deleteTag
 *	-H 'Content-Type: application/json'
 *	-d '{
 *       "tag": "Engineering"
 *      }'
 * @author: Steven Li
 */
router.post("/deleteTag", async function (req, res, next) {
  let tag = req.body.tag;

  try {
    let result = await tags.removeTag(tag);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

/**
 * @api {post} /assignTagsToCourse
 * @apiDescription assign tags to a specified course
 * @apiExample {curl} Example usage: 
 * Http:
 *	POST /tags/assignTagsToCourse HTTP/1.1
 *	Host: localhost:3001
 *	Content-Type: application/json
 *	    {
 *        "course": "ECSE 489",
 *        "tag": ["Networking", "Engineering"]
 *      }
 * Curl:
 *	curl -X POST
 *	http://localhost:3001/tags/assignTagsToCourse
 *	-H 'Content-Type: application/json'
 *	-d '{
 *        "course": "ECSE 489",
 *        "tag": ["Networking", "Engineering"]
 *      }'
 * @author: Steven Li
 */
router.post("/assignTagsToCourse", async function (req, res, next) {
  let course = req.body.course;
  let tag;

  try {
    tag = JSON.parse(req.body.tags);
  } catch (err) {
    res.status(500).send("invalid format tags");
  }

  try {
    let result = await tags.assignTagsToCourse(course, tag);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;