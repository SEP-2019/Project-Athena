const mysql = require("../../sql/connection");
const format = require("../../validation/format");

/**
 * Returns all tags
 * @author Steven Li
 * @returns A list of tags in JSON format
 * @throws error if MySQL connection failed
 */
var getAllTags = async () => {
  let connection = await mysql.getNewConnection();
  let result = [];
  result = await connection.query("SELECT name FROM tags;");
  connection.release();
  return result;
};

/**
 * Adds a tag into the database.
 * @author Steven Li
 * @param {String} tag
 * @returns true if successful
 * @throws error if MySQL connection failed
 *         false if insertion failed
 *         invalid format tag if tag is null
 */
var addTag = async tag => {
  format.verifyTag(tag);
  let connection = await mysql.getNewConnection();
  try {
    await connection.query("INSERT INTO tags (name) VALUES (?);", tag);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
};

/**
 * Removes a tag from the database.
 * @author Steven Li
 * @param {String} tag
 * @returns true if successful
 * @throws error if MySQL connection failed
 *         false if deletion failed
 *         invalid format tag if tag is null
 */
var removeTag = async tag => {
  format.verifyTag(tag);
  let connection = await mysql.getNewConnection();
  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM course_tags WHERE tag_name = ?;", tag);
    await connection.query("DELETE FROM tags WHERE name = ?;", tag);
    await connection.commit();
    return true;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new Error(false);
  } finally {
    connection.release();
  }
};

/**
 * Assigns tags to a course.
 * @param {String} course A course code
 * @param {Array} tags An array of tags
 */
var assignTagsToCourse = async (course, tags) => {
  format.verifyCourseCode(course);
  if (!tags) {
    throw new Error("invalid format tag");
  }
  for (let i = 0; i < tags.length; i++) {
    format.verifyTag(tags[i]);
  }
  let connection = await mysql.getNewConnection();

  try {
    await connection.beginTransaction();
    // Remove old entries
    await connection.query(
      "DELETE FROM course_tags WHERE course_code = ?;",
      course
    );

    // Add new entries
    for (let i = 0; i < tags.length; i++) {
      await connection.query(
        "INSERT INTO course_tags (course_code, tag_name) VALUES (?, ?);",
        [course, tags[i]]
      );
    }
    await connection.commit();
    return true;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    throw new Error(false);
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllTags,
  addTag,
  removeTag,
  assignTagsToCourse
};
