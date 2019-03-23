const mysql = require("../../sql/connection");
const format = require("../../validation/format");
const hasher = require("../../validation/hash");
let CustomError = require("../../validation/CustomErrors").CustomError;

var insertStudentUser = async (username, password, email, id, program, year, curr_type) => {
  // Connect to database
  // Check for invalid formatting
  format.verifyUsername(username);
  format.verifyPassword(password);
  format.verifyEmail(email);
  format.verifyStudentId(id);
  format.verifyCurriculumName(program);
  format.verifyYear(year);
  format.verifyCurriculumName(curr_type);

  let nextYear = (parseInt(year, 10) + 1).toString(10);
  let major = program.concat("|", year, "|", nextYear, "|", curr_type);

  let conn = await mysql.getNewConnection();
  let ifMajorExist;

  try {
    ifMajorExist = await conn.query(`SELECT COUNT(*) AS count FROM curriculums WHERE curriculum_name = ?;`, [major]);
  } catch (err) {
    console.log(err);
    throw Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }

  if (ifMajorExist[0].count === 0) {
    throw Error(`Curriculum with name ${major} does not exist!`);
  }

  let connection = await mysql.getNewConnection();
  // Hash the password
  let hash = hasher.hashPass(password);

  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO users (username, email, password) VALUES(?, ?, ?);", [username, email, hash]);
    await connection.query("INSERT INTO students (student_id, username) VALUES(?, ?);", [id, username]);
    await connection.query("INSERT INTO student_majors (student_id, curriculum_name) VALUES(?, ?);", [id, major]);
    await connection.commit();
    connection.release();
    return email;
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
    let student_id = await connection.query("SELECT student_id FROM students WHERE username = ?;", username);
    await connection.query("DELETE FROM student_majors WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM student_minors WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM student_desired_courses WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM student_course_offerings WHERE student_id = ?;", [student_id[0].student_id]);
    await connection.query("DELETE FROM students WHERE username = ?;", [username]);
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
    await connection.query("INSERT INTO users (username, email, password) VALUES(?, ?, ?);", [username, email, hash]);
    await connection.query("INSERT INTO staff_members (staff_id, username) VALUES(?, ?);", [id, username]);
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
    let staff_id = await connection.query("SELECT staff_id FROM staff_members WHERE username = ?;", username);
    await connection.query("DELETE FROM staff_members WHERE staff_id = ?;", [staff_id[0].staff_id]);

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
  let completedCourses, major, minors;
  try {
    completedCourses = await conn.query(
      `SELECT course_offerings.course_code, course_offerings.semester, 
            courses.title, courses.description, courses.credits
    FROM course_offerings
    JOIN courses ON (course_offerings.course_code = courses.course_code)
    WHERE (course_offerings.id, course_offerings.semester)
    IN (SELECT offering_id, semester FROM student_course_offerings WHERE student_id = ?);`,
      [studentID]
    );

    major = await conn.query(`SELECT curriculum_name FROM student_majors WHERE student_id = ?;`, [studentID]);

    minors = await conn.query(`SELECT curriculum_name FROM student_minors WHERE student_id = ?;`, [studentID]);

    let currYear = new Date().getFullYear();
    let currMonth = new Date().getMonth();
    let fallSem, winterSem;

    if (major.length == 0) {
      throw new Error("Student does not have any majors");
    }

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
        `SELECT description, title, credits
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
        `SELECT description, title, credits
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
  try {
    let userInfo = await connection.query("SELECT * FROM users WHERE username = ?;", [username]);

    if (userInfo == undefined || userInfo.length == 0) {
      throw new CustomError("User does not exist", 400);
    }

    if (!userInfo || !isValidPassword(userInfo[0].password, password)) {
      throw new CustomError("Incorrect username or password.", 400);
    }

    return userInfo[0].email;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
};

var assignStudentMinor = async (studentID, minor) => {
  format.verifyStudentId(studentID);
  format.verifyCurriculumName(minor);

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
    throw Error(`Student user with student ID ${studentID} does not exist!`);
  } else if (ifMinorExist[0].count === 0) {
    throw Error(`Curriculum with name ${minor} does not exist!`);
  } else if (existingMinor[0].count !== 0 && existingMinor[0].curriculum_name === minor) {
    throw Error(`Student is already assigned to ${minor} as a minor`);
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
    return true;
  } catch (err) {
    await conn.rollback();
    console.log(err);
    throw new Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }
};

var updateStudentMajor = async (student_id, program, year, curr_type) => {
  format.verifyStudentId(student_id);
  format.verifyCurriculumName(program);
  format.verifyYear(year);
  format.verifyCurriculumName(curr_type);

  let nextYear = (parseInt(year, 10) + 1).toString(10);
  let major = program.concat("|", year, "|", nextYear, "|", curr_type);

  let conn = await mysql.getNewConnection();
  let ifUserExist;
  let ifMajorExist;
  try {
    ifUserExist = await conn.query(`SELECT COUNT(*) AS count FROM students WHERE student_id = ?;`, [student_id]);
    ifMajorExist = await conn.query(`SELECT COUNT(*) AS count FROM curriculums WHERE curriculum_name = ?;`, [major]);
  } catch (err) {
    console.log(err);
    throw Error("Internal Server Error!\n");
  } finally {
    conn.release();
  }

  if (ifUserExist[0].count === 0) {
    throw Error(`Student user with student ID ${student_id} does not exist!`);
  } else if (ifMajorExist[0].count === 0) {
    throw Error(`Curriculum with name ${major} does not exist!`);
  }
  let connection = await mysql.getNewConnection();
  try {
    await connection.beginTransaction();
    await connection.query("UPDATE student_majors SET curriculum_name = ? WHERE student_id = ?", [major, student_id]);
    await connection.commit();
    return true;
  } catch (error) {
    connection.rollback();
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
  getStudentData,
  assignStudentMinor,
  updateStudentMajor
};
