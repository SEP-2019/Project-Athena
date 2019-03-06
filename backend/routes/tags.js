const express = require("express");
const tags = require("../logic/tags/tags");
const router = express.Router();
let customResponse = require("../validation/customResponse");
let asyncMiddleware = require("./errorHandlingMiddleware");

/**
 * @api {get} /getAllTags
 * @apiDescription gets a list of tags
 * @apiExample {curl} Example usage: GET /tags/getAllTags
 * @author: Steven Li
 */
router.get(
  "/getAllTags",
  asyncMiddleware(async function(req, res, next) {
    let result = await tags.getAllTags();
    res.send(customResponse(result));
  })
);

module.exports = router;
