const mysql = require("../../sql/connection");
const format = require("../../validation/format");
const hasher = require("../../validation/hash");

var insertStudentUser = async (username, password, email, id) => {
  // Connect to database
  // Check for invalid formatting
  format.verifyUsername(username);
  format.verifyPassword(password);
  format.verifyEmail(email);
  format.verifyStudentId(id);

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
    throw error;
  }
};

var deleteStudentUser = async username => {
  format.verifyUsername(username);
  let connection = await mysql.getNewConnection();
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
    connection.rollback();
    connection.release();
    throw error;
  }
};

var insertAdminUser = async (username, password, email, id) => {
  // Connect to database
  // Check for invalid formatting
  format.verifyUsername(username);
  format.verifyPassword(password);
  format.verifyEmail(email);
  format.verifyId(id);

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
    throw error;
  }
};

var deleteAdminUser = async username => {
  format.verifyUsername(username);

  let connection = await mysql.getNewConnection();

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
    return true;
  } catch (error) {
    connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

var getCompletedCourses = async studentID => {
  format.verifyStudentId(studentID);

  const sql_query = `SELECT course_code, semester
  		FROM course_offerings
  		WHERE (id, semester)
  		IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`;

  let conn = await mysql.getNewConnection();
  try {
    let results = await conn.query(sql_query, [studentID]);
    return results;
  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
};

var getStudentData = async studentID => {
  format.verifyStudentId(studentID);

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
      `SELECT curriculum_name FROM student_majors WHERE student_id = ?;`,
      [studentID]
    );
    minor = await conn.query(
      `SELECT curriculum_name FROM student_minors WHERE student_id = ?;`,
      [studentID]
    );
    conn.release();

    let results = { major: major, minor: minor, courses: courses };
    return results;
  } catch (err) {
    conn.release();
    throw err;
  }
};

var login = async (username, password) => {
  let isValidPassword = function(userpass, password) {
    return hasher.hashPass(password) === userpass;
  };

  // Check for invalid formatting
  format.verifyUsername(username);
  format.verifyPassword(password);
  let connection = await mysql.getNewConnection();

  // Begin transaction with database
  try {
    let userInfo = await connection.query(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );
    if (!userInfo || !isValidPassword(userInfo[0].password, password)) {
      throw new Error("Incorrect username or password.");
    }
    return true;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  insertStudentUser,
  deleteStudentUser,
  insertAdminUser,
  deleteAdminUser,
  getCompletedCourses,
  login,
  getStudentData
};
