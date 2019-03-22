const mysql = require("../../sql/connection");
const format = require("../../validation/format");

/**
 * @Returns a curriculum and its associated courses from the database
 * @author Feras Al Taha and Alex Lam
 * @returns a curriculum and its core classes & tech comps from the database in JSON format
 * @throws error if MySQL connection failed
 */
var getCurriculum = async function(name) {
  if (!name) {
    throw Error("Name cannot be empty");
  }

  let connection = await mysql.getNewConnection();

  try {
    let curriculum = await connection.query("SELECT * FROM curriculums WHERE curriculum_name=?;", name);

    let core_classes = await connection.query("SELECT course_code FROM curriculum_core_classes WHERE curriculum_name=?;", name);

    let tech_comps = await connection.query("SELECT course_code FROM curriculum_tech_comps WHERE curriculum_name=?;", name);

    let complementaries = await connection.query("SELECT course_code FROM curriculum_complementaries WHERE curriculum_name=?;", name);

    curriculum = JSON.parse(JSON.stringify(curriculum[0]));
    core_classes = JSON.parse(JSON.stringify(core_classes));
    tech_comps = JSON.parse(JSON.stringify(tech_comps));
    complementaries = JSON.parse(JSON.stringify(complementaries));

    curriculum.core_classes = core_classes;
    curriculum.tech_comps = tech_comps;
    curriculum.complementaries = complementaries;

    return curriculum;
  } catch (err) {
    console.error(err);
    throw Error("Internal server error");
  } finally {
    connection.release();
  }
};

var createCurriculum = async (name, type, department, numOfElectives, cores, techComps, comps) => {
  let error = false;

  if (!format.verifyCurriculumName(name)) {
    error = "Invalid curriculum name";
  } else if (!format.verifyDepartmentName(department)) {
    error = "Invalid department";
  } else if (!format.verifyNumOfElectives(numOfElectives)) {
    error = "Invalid number of electives";
  } /*else if (!format.verifyCurrType(type)) {
    error = "Invalid curriculum type";
  }*/

  if (!error == false) {
    console.error(error);
    throw new Error(error.message);
  }

  try {
    await format.verifyCourseCodes(cores);
    await format.verifyCourseCodes(techComps);
    await format.verifyCourseCodes(comps);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }

  let connection = await mysql.getNewConnection();

  try {
    await connection.beginTransaction();
    await connection.query("INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);", [
      name,
      type,
      department,
      numOfElectives
    ]);
    for (var i = 0; i < cores.length; i++) {
      let course_count = await connection.query("SELECT COUNT(*) FROM courses WHERE course_code = ?;", [cores[i]]);

      if (course_count) {
        await connection.query("INSERT INTO curriculum_core_classes (curriculum_name, course_code) VALUES(?, ?);", [name, cores[i]]);
      } else {
        throw new Error("Course ${cores[i]} does not exist\n");
      }
    }
    for (var i = 0; i < techComps.length; i++) {
      let course_count = await connection.query("SELECT COUNT(*) FROM courses WHERE course_code = ?;", [techComps[i]]);

      if (course_count) {
        await connection.query("INSERT INTO curriculum_tech_comps (curriculum_name, course_code) VALUES(?, ?);", [name, techComps[i]]);
      } else {
        throw new Error("Course ${techComps[i]} does not exist\n");
      }
    }
    for (var i = 0; i < comps.length; i++) {
      let course_count = await connection.query("SELECT COUNT(*) FROM courses WHERE course_code = ?;", [comps[i]]);
      if (course_count) {
        await connection.query("INSERT INTO curriculum_complementaries (curriculum_name, course_code) VALUES(?, ?);", [name, comps[i]]);
      } else {
        throw new Error("Course ${comps[i]} does not exist\n");
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
