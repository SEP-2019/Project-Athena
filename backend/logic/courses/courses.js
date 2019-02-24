const mysql = require('../../sql/connection');
const format = require('../../validation/format');

async function queryCourseByTag(tag) {
    if (!tag) {
        throw Error("Undefined tag")
    }

    let connection = await mysql.getNewConnection();
    try {
        let courses = await connection.query('SELECT course_code FROM course_tag WHERE course_tag.tag_name LIKE ?', tag);
        connection.release();
        return (JSON.parse(JSON.stringify(courses)));
    } catch (error) {
        connection.release();
        console.error(error);
        throw Error(error.message);
    }
}

/**
 * Adds a course into the database
 * @author Mathieu Savoie
 * @param {String} courseCode
 * @param {String} title
 * @param {String} departement
 * @returns true if successful
 * @throws error if MySQL connection failed
 *         invalid format courses if JSON format is incorrect
 *         false if insertion failed
 */
var addCourse = async (courseCode, title, departement, phasedOut) => {
  // Connect to database
  let error = false
  // Check for invalid formatting
  // Handle errors related to formatting, throw errors if wrong format
  if (!format.verifyCourseCode(courseCode)) {
    error = "invalid format courseCode";
  } else if (!format.verifyTitle(title)) {
    error = "invalid format title";    
  } else if (!format.verifyDepartment(departement)) {
    error = "invalid format departement";
  } else if (!format.verifyPhaseOut(phasedOut)){
    error = "invalid format phasedOut";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let connection = await mysql.getNewConnection();
  
   try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO courses VALUES(?, ?, ?, ?);", [courseCode, title, departement, phasedOut]);
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

module.exports = {
  addCourse,
  queryCourseByTag
};