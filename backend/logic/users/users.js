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
  } else if (!format.verifyStudentId(id)) {
    error = "invalid format id";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let connection = await mysql.getNewConnection();

  // Hash the password
  let hash = hasher.hashPass(password);

  try {
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
    return true;
  } catch (error) {
    connection.rollback();
    connection.release();
    console.error(error);
    throw new Error(false);
  }
};

var deleteStudentUser = async username => {
  if (!format.verifyUsername(username)) {
    let error = "invalid username";
    console.error(error);
    throw new Error(error);
  }

  let connection;
  try {
    connection = await mysql.getNewConnection();
  } catch (error) {
    console.error(error);
    throw new Error("failed to establish connection with database");
  }

  try {
    await connection.beginTransaction();
    let student_id = await connection.query(
      "SELECT student_id FROM students WHERE username = ?;",
      username
    );
    await connection.query("DELETE FROM students WHERE student_id = ?;", [
      student_id[0].student_id
    ]);
    await connection.query("DELETE FROM users WHERE username = ?;", [username]);
    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.error(error);
    connection.rollback();
    connection.release();
    throw new Error(false);
  }
};

var insertAdminUser = async (username, password, email, id) => {
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
  } else if (!format.verifyAdminId(id)) {
    error = "invalid format id";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let connection = await mysql.getNewConnection();

  // Hash the password
  let hash = hasher.hashPass(password);
  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO users VALUES(?, ?, ?);", [
      username,
      email,
      hash
    ]);
    await connection.query("INSERT INTO staff_members VALUES(?, ?);", [
      id,
      username
    ]);
    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    connection.rollback();
    connection.release();
    console.error(error);
    throw new Error(false);
  }
};

var deleteAdminUser = async username => {
  if (!format.verifyUsername(username)) {
    let error = "invalid username";
    console.error(error);
    throw new Error(error);
  }

  let connection;
  try {
    connection = await mysql.getNewConnection();
  } catch (error) {
    console.error(error);
    throw new Error("failed to establish connection with database");
  }

  try {
    await connection.beginTransaction();
    let staff_id = await connection.query(
      "SELECT staff_id FROM staff_members WHERE username = ?;",
      username
    );
    await connection.query("DELETE FROM staff_members WHERE staff_id = ?;", [
      staff_id[0].staff_id
    ]);
    await connection.query("DELETE FROM users WHERE username = ?;", [username]);
    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    console.error(error);
    connection.rollback();
    connection.release();
    throw new Error(false);
  }
};

var getCompletedCourses = async studentID => {
  let courses = [];

  const sql_query = `SELECT course_code, semester
  		FROM course_offerings
  		WHERE (id, semester)
  		IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`;

  let connection = await mysql.getNewConnection();
  let results;
  try {
    results = await connection.query(sql_query, [studentID]);
    connection.release();
  } catch (err) {
    connection.release();
    console.log(err);
  }

  if (results) {
    courses = JSON.stringify(results);
  }
  return courses;
};

var getStudentData = async studentID => {
  let error = false;
  if (!format.verifyStudentId(studentID)) {
    error = "invalid format id";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let data;
  let conn = await mysql.getNewConnection();
  let courses, major, minor;
  try {
    courses = await conn.query(
      `SELECT course_code, semester
    FROM course_offerings
    WHERE (id, semester)
    IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`,
      [studentID]
    );
    major = await conn.query(
      `SELECT curriculum_name FROM student_major WHERE student_id = ?;`,
      [studentID]
    );
    minor = await conn.query(
      `SELECT curriculum_name FROM student_minor WHERE student_id = ?;`,
      [studentID]
    );
    conn.release();

    let results = { major: major, minor: minor, courses: courses };

    if (results) {
      data = JSON.stringify(results);
    }
    return data;
  } catch (err) {
    conn.release();
    console.log(err);
    throw new Error(err);
  }
};

module.exports = {
  insertStudentUser,
  deleteStudentUser,
  insertAdminUser,
  deleteAdminUser,
  getCompletedCourses,
  getStudentData
};
