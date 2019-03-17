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
    await connection.query(
      "INSERT INTO users (username, email, password) VALUES(?, ?, ?);",
      [username, email, hash]
    );
    await connection.query(
      "INSERT INTO students (student_id, username) VALUES(?, ?);",
      [id, username]
    );
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
    await connection.query("INSERT INTO users (username, email, password) VALUES(?, ?, ?);", [
      username,
      email,
      hash
    ]);
    await connection.query("INSERT INTO staff_members (staff_id, username) VALUES(?, ?);", [
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

  let data;
  let conn = await mysql.getNewConnection();
  let completedCourses, major, minors;
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
      c.description = await conn.query(
        `SELECT description
        FROM courses
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
      c.description = await conn.query(
        `SELECT description
        FROM courses
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
