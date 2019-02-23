const express = require("express");
const tags = require("../logic/tags/tags");
const router = express.Router();

/*
 * @api {get} /getAllTags
 * @apiDescription gets a list of tags
 * @apiExample {curl} Example usage: GET /tags/getAllTags
 * @author: Steven Li
 */
router.get("/getAllTags", async function(req, res, next) {
  try {
    let result = await tags.getAllTags();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
