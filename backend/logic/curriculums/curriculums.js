const mysql = require("../../sql/connection");
const format = require("../../validation/format");

/**
 * Returns a curriculum and its associated courses from the database
 * @author Feras Al Taha
 * @returns a curriculum and its core classes & tech comps from the database in JSON format
 * @throws error if MySQL connection failed
 */
var getCurriculum = async function(name) {
  let connection = await mysql.getNewConnection();
  let curriculum, core_classes, tech_comps;
  try {
    curriculum = await connection.query(
      "SELECT * FROM curriculums WHERE name=?;",
      name
    );

    core_classes = await connection.query(
      "SELECT course_code FROM curriculum_core_classes WHERE curriculum_name=?;",
      name
    );

    tech_comps = await connection.query(
      "SELECT course_code FROM curriculum_tech_comps WHERE curriculum_name=?;",
      name
    );

    //TODO: In addition to curriculum object, 
    // need to add attribute for having list of core classes and list of tech compes
    // {name: "EE ...", type: "Major", ..., core_classes: [{course_code:"ECSE 362"},{...}], tech_comps: [...]}
    // Can use same format that Tyrone used in his script

    return curriculum;
  } catch (err) {
    console.error(err);
  } finally {
    connection.release();
  }
};

var createCurriculum = async (
  name,
  type,
  department,
  numOfElectives,
  cores,
  techComps,
  comps
) => {
  let error = false;

  if (!format.verifyCurriculumName(name)) {
    error = "Invalid curriculum name";
  } else if (!format.verifyCurrType(type)) {
    error = "Invalid curriculum type";
  } else if (!format.verifyDepartment(department)) {
    error = "Invalid department";
  } else if (!format.verifyNumOfElectives(numOfElectives)) {
    error = "Invalid number of electives";
  }

  if (!error == false) {
    console.error(error);
    throw new Error(error.message);
  }

  try {
    format.verifyCourse(cores);
    format.verifyCourse(techComps);
    format.verifyCourse(comps);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }

  let connection = await mysql.getNewConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);",
      [name, type, department, numOfElectives]
    );
    for (let core in cores) {
      let course_count = await connection.query(
        "SELECT COUNT(*) FROM courses WHERE course_code = ?;",
        [core]
      );

      if (course_count) {
        await connection.query(
          "INSERT INTO curriculum_core_class (curriculum_name, course_code) VALUES(?, ?);",
          [name, core]
        );
      } else {
        throw new Error("Course ${core} does not exist");
      }
    }
    for (let techComp in techComps) {
      let course_count = await connection.query(
        "SELECT COUNT(*) FROM courses WHERE course_code = ?;",
        [techComp]
      );

      if (course_count) {
        await connection.query(
          "INSERT INTO curriculum_tech_comp (curriculum_name, course_code) VALUES(?, ?);",
          [name, techComp]
        );
      } else {
        throw new Error("Course ${techComp} does not exist");
      }
    }
    for (let comp in comps) {
      let course_count = await connection.query(
        "SELECT COUNT(*) FROM courses WHERE course_code = ?;",
        [comp]
      );
      if (course_count) {
        await connection.query(
          "INSERT INTO curriculum_complementaries (curriculum_name, course_code) VALUES(?, ?);",
          [name, comp]
        );
      } else {
        throw new Error("Course ${comp} does not exist");
      }
    }
    await connection.commit();
    return true;
  } catch (error) {
    connection.rollback();
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
};

module.exports = {
  createCurriculum,
  getCurriculum
};
