const mysql = require('../../sql/connection');

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

var addCourse = async (courseCode, title, departement) => {
  // Connect to database
  let error = false
  // Check for invalid formatting
  // Handle errors related to formatting, throw errors if wrong format
  if (!format.verifyCourseCode(courseCode)) {
    error = "invalid format courseCode";
  } else if (!format.verifyDepartment(departement)) {
    error = "invalid format departement";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error);
  }

  let connection;
  try {
    connection = await mysql.getNewConnection();
  } catch (error) {
    throw new Error("failed to establish connection with database");
  }
  
   try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO courses VALUES(?, ?, ?);", [courseCode, title, departement]);
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

module.exports.queryCourseByTag = queryCourseByTag;