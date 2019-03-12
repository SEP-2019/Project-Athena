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
  let completedCourses, incompletedCourses, major, minors;
  try {
    completedCourses = await conn.query(
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
    minors = await conn.query(
      `SELECT curriculum_name FROM student_minors WHERE student_id = ?;`,
      [studentID]
    );

    let currYear = new Date().getFullYear();
    let currMonth = new Date().getMonth();
    let fallSem, winterSem;
    let curriculumName = major[0].curriculum_name;

    if (currMonth < 3) {
      fallSem = "";
      winterSem = "W" + currYear;
    } else {
      fallSem = "F" + currYear;
      winterSem = "W" + (currYear + 1);
    }

    let incompleteCore = await conn.query(
       `SELECT course_code, semester 
      FROM course_offerings 
      WHERE (id 
              NOT IN (SELECT offering_id 
                      FROM student_course_offerings 
                      WHERE student_id = ?)) 
      AND (semester = ? OR semester = ?) 
      AND (course_code 
          IN (SELECT course_code 
              FROM curriculum_core_classes 
              WHERE curriculum_name = ?));`,
      [studentID, fallSem, winterSem, curriculumName]
    );
    let desiredTC = await conn.query(
      `SELECT course_code, semester 
      FROM course_offerings 
      WHERE (id 
            NOT IN (SELECT offering_id 
                    FROM student_course_offerings 
                    WHERE student_id = ?))
      AND (semester = ? OR semester = ?) 
      AND (course_code 
          IN (SELECT course_code 
              FROM curriculum_tech_comps 
              WHERE curriculum_name = ?)) 
      AND (course_code
          IN (SELECT course_code 
              FROM student_desired_courses 
              WHERE student_id = ?));`,
      [studentID, fallSem, winterSem, curriculumName, studentID]
    );

    for (let i = 0; i < incompleteCore.length; i++) {
      let c = incompleteCore[i];
      c.prereqs = await conn.query(
        `SELECT prereq_course_code 
        FROM course_prereqs 
        WHERE course_code = ?;`,
        [c.course_code]
      );
      c.coreqs = await conn.query(
        `SELECT coreq_course_code 
        FROM course_coreqs 
        WHERE course_code = ?;`,
        [c.course_code]
      );
    }

    for (let i = 0; i < desiredTC.length; i++) {
      let c = desiredTC[i];
      c.prereqs = await conn.query(
        `SELECT prereq_course_code 
        FROM course_prereqs 
        WHERE course_code = ?;`,
        [c.course_code]
      );
      c.coreqs = await conn.query(
        `SELECT coreq_course_code 
        FROM course_coreqs 
        WHERE course_code = ?;`,
        [c.course_code]
      );
    }

    conn.release();

    let results = {
      major: major,
      minor: minors,
      completedCourses: completedCourses,
      incompletedCore: incompleteCore,
      desiredTC: desiredTC
    };

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
    let userInfo = await connection.query(
      "SELECT * FROM users WHERE username = ?;",
      [username]
    );

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

module.exports = {
  insertStudentUser,
  deleteStudentUser,
  insertAdminUser,
  deleteAdminUser,
  getCompletedCourses,
  login,
  getStudentData
};
