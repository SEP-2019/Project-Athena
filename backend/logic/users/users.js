const mysql = require('../../sql/connection');
const format = require('../../validation/format');
const hasher = require('../../validation/hash');

var insertStudentUser = async (username, password, email, id) => {
  // Check for invalid formatting
  format.verifyStudentUserInput(username, password, email, id)

  // Hash the password
  let hash = hasher.hashPass(password);
  let connection = await mysql.getNewConnection()

  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO users VALUES(?, ?, ?);", [username, email, hash]);
    await connection.query("INSERT INTO students VALUES(?, ?);", [id, username]);
    await connection.commit();
    connection.release();
    //TODO remove this after test refactoring 
    return true;
  } catch (error) {
    connection.rollback();
    connection.release();
    throw error;
  }
};

var getCompletedCourses = async studentID => {
  let courses = [];
  let connection = await mysql.getNewConnection();
  let results;

  const sql_query = `SELECT course_code, semester
  		FROM course_offerings
  		WHERE (id, semester)
  		IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`;

  try {
    results = await connection.query(sql_query, [studentID]);
    if (results) {
      courses = JSON.parse(JSON.stringify(results));
    }
    console.log(courses)
    connection.release();
    return courses;
  } catch (err) {
    connection.release();
    throw err;
  }
};

module.exports = {
  insertStudentUser,
  getCompletedCourses
};