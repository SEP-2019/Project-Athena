const mysql = require("../../sql/connection");
const format = require("../../validation/format");

/**
 * @Returns a curriculum and its associated courses from the database
 * @author Feras Al Taha and Alex Lam
 * @returns a curriculum and its core classes & tech comps from the database in JSON format
 * @throws error if MySQL connection failed
 */
var getCurriculum = async function(name) {
  format.verifyCurriculumName(name);

  let connection = await mysql.getNewConnection();

  try {
    let curriculum = await connection.query(
      "SELECT * FROM curriculums WHERE curriculum_name=?;",
      name
    );

    let core_classes = await connection.query(
      "SELECT course_code FROM curriculum_core_classes WHERE curriculum_name=?;",
      name
    );

    let tech_comps = await connection.query(
      "SELECT course_code FROM curriculum_tech_comps WHERE curriculum_name=?;",
      name
    );

    let complementaries = await connection.query(
      "SELECT course_code FROM curriculum_complementaries WHERE curriculum_name=?;",
      name
    );

    curriculum = JSON.parse(JSON.stringify(curriculum));
    core_classes = JSON.parse(JSON.stringify(core_classes));
    tech_comps = JSON.parse(JSON.stringify(tech_comps));
    complementaries = JSON.parse(JSON.stringify(complementaries));

    curriculum.core_classes = core_classes;
    curriculum.tech_comps = tech_comps;
    curriculum.complementaries = complementaries;

    return curriculum;
  } catch (err) {
    throw err;
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
  format.verifyCurriculumName(name);
  format.verifyCurrType(type);
  format.verifyDepartmentName(department);
  format.verifyNumOfElectives(numOfElectives);
  await format.verifyCourseCodeList(cores);
  await format.verifyCourseCodeList(techComps);
  await format.verifyCourseCodeList(comps);

  let connection = await mysql.getNewConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      "INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);",
      [name, type, department, numOfElectives]
    );
    for (let i = 0, len = cores.length; i < len; i++) {
      let core = cores[i];
      let course_count = await connection.query(
        "SELECT COUNT(*) FROM courses WHERE course_code = ?;",
        [core]
      );

      if (course_count) {
        await connection.query(
          "INSERT INTO curriculum_core_classes (curriculum_name, course_code) VALUES(?, ?);",
          [name, core]
        );
      } else {
        throw new Error("Course ${core} does not exist");
      }
    }
    for (let i = 0, len = techComps.length; i < len; i++) {
      techComp = techComps[i];
      let course_count = await connection.query(
        "SELECT COUNT(*) FROM courses WHERE course_code = ?;",
        [techComp]
      );

      if (course_count) {
        await connection.query(
          "INSERT INTO curriculum_tech_comps (curriculum_name, course_code) VALUES(?, ?);",
          [name, techComp]
        );
      } else {
        throw new Error("Course ${techComp} does not exist");
      }
    }
    for (let i = 0, len = comps.length; i < len; i++) {
      let comp = comps[i];
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
    throw error;
  } finally {
    connection.release();
  }
};

var getCurriculumYears = async () => {
  let connection = await mysql.getNewConnection();
  let years = [];
  let curriculumNames = await connection.query(
    "SELECT curriculum_name FROM curriculums;"
  );
  for (let i = 0; i < curriculumNames.length; i++) {
    let name = curriculumNames[i].curriculum_name;
    arrName = name.split('|');
    console.log(arrName)
    if(!(arrName[1] == undefined || arrName[2] == undefined)){
      let curriculumYear = arrName[1] + "|" + arrName[2];
      years.push(curriculumYear);
    }
  }

  return years;
};

module.exports = {
  createCurriculum,
  getCurriculum,
  getCurriculumYears
};
