const mysql = require("../../sql/connection");
const format = require("../../validation/format");
const hasher = require("../../validation/hash");
const util = require("util");

var insertStudentUser = async (username, password, email, id) => {
  // Connect to database
  let error = false;
  // Check for invalid formatting
  //todo, handle errors after formatting configured to throw errors
  if (!format.verifyUsername(username)) {
    error = "invalid format username";
  } else if (!format.verifyPassword(password)) {
    error = "invalid format password";
  } else if (!format.verifyEmail(email)) {
    error = "invalid format email";
  } else if (!format.verifyId(id)) {
    error = "invalid format id";
  }

  console.error(error);
  if (!error == false) {
    console.error(error);
    //TODO replace this with an error when tests are fixed for it
    return error;
  }

  // Hash the password
  let hash = hasher.hashPass(password);
  try {
    let connection = await mysql.getNewConnection();
    await connection.beginTransaction();
    await connection.query("INSERT INTO users VALUES(?, ?, ?);", [
      username,
      email,
      hash
    ]);
    await connection.query("INSERT INTO students VALUES(?, ?);", [
      id,
      username
    ]);
    await connection.commit();
    connection.release();
    //TODO remove this after test refactoring
    return true;
  } catch (error) {
    connection.rollback();
    connection.release();
    console.error(error);
    return false;
  }
};

var getCompletedCourses = async studentID => {
  let courses = [];

  const sql_query = `SELECT course_code, semester
  		FROM course_offerings
  		WHERE (id, semester)
  		IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`;

  let conn = await mysql.getNewConnection();

  let results;
  try {
    results = await conn.query(sql_query, [studentID]);
  } catch (err) {
    console.log(err);
  }

  if (results) {
    courses = JSON.stringify(results);
  }
  return courses;
};

var getStudentData = async studentID => {
  let data;

  let sql_query = `SELECT course_code, semester
  		FROM course_offerings
  		WHERE (id, semester)
  		IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`;

  let conn = await mysql.getNewConnection();

  let courses;
  try {
    courses = await conn.query(sql_query, [studentID]);
  } catch (err) {
    console.log(err);
  }

  sql_query = `SELECT curriculum_name FROM student_major WHERE student_id = ?;`;

  let major;
  try {
    major = await conn.query(sql_query, [studentID]);
  } catch (err) {
    console.log(err);
  }

  sql_query = `SELECT curriculum_name FROM student_minor WHERE student_id = ?;`;

  let minor;
  try {
    minor = await conn.query(sql_query, [studentID]);
  } catch (err) {
    console.log(err);
  }

  let results = { major: major, minor: minor, courses: courses };

  if (results) {
    data = JSON.stringify(results);
  }
  return data;
};

module.exports = {
  insertStudentUser,
  getCompletedCourses,
  getStudentData
};
