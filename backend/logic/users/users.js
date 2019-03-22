const mysql = require("../../sql/connection");
const format = require("../../validation/format");
const hasher = require("../../validation/hash");

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
    await connection.query("INSERT INTO users VALUES(?, ?, ?);", [username, email, hash]);
    await connection.query("INSERT INTO students VALUES(?, ?);", [id, username]);
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
    let student_id = await connection.query("SELECT student_id FROM students WHERE username = ?;", username);
    await connection.query("DELETE FROM student_majors WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM student_minors WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM students WHERE student_id = ?;", [student_id[0].student_id]);
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
    await connection.query("INSERT INTO users (username, email, password) VALUES(?, ?, ?);", [username, email, hash]);
    await connection.query("INSERT INTO staff_members (staff_id, username) VALUES(?, ?);", [id, username]);
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
    let staff_id = await connection.query("SELECT staff_id FROM staff_members WHERE username = ?;", username);
    await connection.query("DELETE FROM staff_members WHERE staff_id = ?;", [staff_id[0].staff_id]);
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

  let conn = await mysql.getNewConnection();
  let results;
  try {
    results = await conn.query(sql_query, [studentID]);
    if (results.length !== 0) {
      courses = JSON.stringify(results);
    }

    return courses;
  } catch (err) {
    console.log(err);
    return "Interval serever error!";
  } finally {
    conn.release();
  }
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
    major = await conn.query(`SELECT curriculum_name FROM student_majors WHERE student_id = ?;`, [studentID]);
    minor = await conn.query(`SELECT curriculum_name FROM student_minors WHERE student_id = ?;`, [studentID]);
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

var login = async (username, password) => {
  let error = false;

  let isValidPassword = function(userpass, password) {
    return hasher.hashPass(password) === userpass;
  };

  // Check for invalid formatting
  if (!format.verifyUsername(username)) {
    error = "Invalid format username";
  } else if (!format.verifyPassword(password)) {
    error = "Invalid format password";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  // Begin transaction with database
  try {
    let connection = await mysql.getNewConnection();
    let userInfo = await connection.query("SELECT * FROM users WHERE username = ?;", [username]);

    if (!userInfo || !isValidPassword(userInfo[0].password, password)) {
      throw new Error("Incorrect username or password.");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  } finally {
    connection.release();
  }
};

var assignStudentMajor = async (studentID, major) => {
  let error = false;

  if (!format.verifyStudentId(studentID)) {
    error = "Invalid student id";
  } else if (!format.verifyCurriculumName(major)) {
    error = "Invalid curriculum name";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let ifUserExist;
  let ifMajorExist;
  let existingMajor;

  let conn = await mysql.getNewConnection();
  try {
    ifUserExist = await conn.query(`SELECT COUNT(*) AS count FROM students WHERE student_id = ?;`, [studentID]);
    ifMajorExist = await conn.query(`SELECT COUNT(*) AS count FROM curriculums WHERE curriculum_name = ?;`, [major]);
    existingMajor = await conn.query(`SELECT COUNT(*) AS count FROM student_majors WHERE student_id = ?;`, [studentID]);
  } catch (err) {
    console.log(err);
    throw Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }

  if (ifUserExist[0].count === 0) {
    throw Error(`Student user with student ID ${studentID} does not exist!\n`);
  } else if (ifMajorExist[0].count === 0) {
    throw Error(`Curriculum with name ${major} does not exist!\n`);
  } else if (existingMajor[0].count !== 0 && existingMajor[0].curriculum_name === major) {
    throw Error(`Student is already assigned to ${major} as a major\n`);
  }

  conn = await mysql.getNewConnection();
  try {
    await conn.beginTransaction();
    if (existingMajor[0].count === 0) {
      await conn.query("INSERT INTO student_majors (student_id, curriculum_name) VALUES(?, ?);", [studentID, major]);
    } else {
      await conn.query("UPDATE student_majors SET curriculum_name = ? WHERE student_id = ?", [major, studentID]);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.log(err);
    throw new Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }
};

var assignStudentMinor = async (studentID, minor) => {
  let error = false;

  if (!format.verifyStudentId(studentID)) {
    error = "Invalid student id";
  } else if (!format.verifyCurriculumName(minor)) {
    error = "Invalid curriculum name";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let ifUserExist;
  let ifMinorExist;
  let existingMinor;

  let conn = await mysql.getNewConnection();
  try {
    ifUserExist = await conn.query(`SELECT COUNT(*) AS count FROM students WHERE student_id = ?;`, [studentID]);
    ifMinorExist = await conn.query(`SELECT COUNT(*) AS count FROM curriculums WHERE curriculum_name = ?;`, [minor]);
    existingMinor = await conn.query(`SELECT COUNT(*) AS count FROM student_minors WHERE student_id = ?;`, [studentID]);
  } catch (err) {
    console.log(err);
    throw Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }

  if (ifUserExist[0].count === 0) {
    throw Error(`Student user with student ID ${studentID} does not exist!\n`);
  } else if (ifMinorExist[0].count === 0) {
    throw Error(`Curriculum with name ${minor} does not exist!\n`);
  } else if (existingMinor[0].count !== 0 && existingMinor[0].curriculum_name === minor) {
    throw Error(`Student is already assigned to ${minor} as a minor\n`);
  }

  conn = await mysql.getNewConnection();
  try {
    await conn.beginTransaction();
    if (existingMinor[0].count === 0) {
      await conn.query("INSERT INTO student_minors (student_id, curriculum_name) VALUES(?, ?);", [studentID, minor]);
    } else {
      await conn.query("UPDATE student_minors SET curriculum_name = ? WHERE student_id = ?", [minor, studentID]);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.log(err);
    throw new Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }
};

module.exports = {
  insertStudentUser,
  deleteStudentUser,
  insertAdminUser,
  deleteAdminUser,
  getCompletedCourses,
  login,
  getStudentData,
  assignStudentMajor,
  assignStudentMinor
};
