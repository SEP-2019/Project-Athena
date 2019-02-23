const mysql = require("../../sql/connection");
const format = require("../../validation/format");

var queryCourseByTag = async function queryCourseByTag(tag) {
  if (!tag) {
    throw Error("Undefined tag");
  }

  let connection = await mysql.getNewConnection();
  try {
    let courses = await connection.query(
      "SELECT course_code FROM course_tag WHERE course_tag.tag_name LIKE ?",
      tag
    );
    connection.release();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    connection.release();
    console.error(error);
    throw Error(error.message);
  }
};

var addCompletedCourses = async (studentId, courses, section) => {
  if (!format.verifyStudentId(studentId)) {
    throw new Error("invalid format id");
  }
  await format.verifyCompletedCourses(courses);

  let connection;
  try {
    connection = await mysql.getNewConnection();
  } catch (error) {
    throw new Error("failed to establish connection with database");
  }

  try {
    await connection.beginTransaction();
    // Obtain all current course offerings and put them into a hashtable for fast lookup
    let results = await connection.query("SELECT * FROM course_offerings;");
    let hashTable = {};
    for (let i = 0; i < results.length; i++) {
      hashTable[
        results[i].course_code + results[i].semester + results[i].section
      ] = results[i].id;
    }

    // Insert each course of the student into the database. If a course does not exist then
    // throw an error.
    for (let course in courses) {
      for (let i = 0; i < courses[course].length; i++) {
        let id =
          hashTable[
            course + courses[course][i].semester + courses[course][i].section
          ];
        await connection.query(
          "INSERT INTO student_course_offerings VALUES(?, ?, ?);",
          [studentId, id, courses[course][i].semester]
        );
      }
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.error(error);
    await connection.rollback();
    connection.release();
    throw new Error(false);
  }
};

async function populateHashTableCourseOfferings(results) {

  return hashTable;
}

module.exports = {
  queryCourseByTag,
  addCompletedCourses
};
