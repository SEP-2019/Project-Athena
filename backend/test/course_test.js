const courses = require("../logic/courses/courses.js");
const assert = require("assert");
const mysql = require("../sql/connection");

describe("Test retrieve course by tag", function() {
  it("responds with valid", async function() {
    connection = await mysql.getNewConnection();
    await connection.query(
      `INSERT INTO courses (course_code,title, department) VALUES
        (?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,
      ["ECSE 428", "Software engineering in practice", "ECSE"]
    );
    await connection.query(
      `INSERT INTO tags(name) VALUES (?) ON DUPLICATE KEY UPDATE name=name;`,
      ["Engineering"]
    );
    await connection.query(
      `INSERT INTO course_tags (course_code, tag_name) VALUES
        (?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,
      ["ECSE 428", "Engineering"]
    );
    await connection.release();
    return courses.getCourseByTag("Engineering").then(function(res) {
      let found = false;
      let searchingFor = { course_code: "ECSE 428" };
      for (course in res) {
        if (JSON.stringify(course) == JSON.stringify(searchingFor))
          found = true;
      }
      assert(true, found);
    });
  });
});

describe("Test assign course to curriculumn", () => {
  before(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(
      "INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);",
      ["Curriculumn Test 1", "Major", "Electrical Engineering", "3"]
    );

    await courses.addCourse(
      "TEST 001",
      "Assign Course to Curriculumn Test 001",
      "TEST",
      "0"
    );

    await courses.addCourse(
      "TEST 002",
      "Assign Course to Curriculumn Test 002",
      "TEST",
      "0"
    );

    await courses.assignCourseToCurriculum(
      "techComp",
      "TEST 001",
      "Curriculumn Test 1"
    );

    conn.release();
  });

  it("returns an error that the course has already been added to a curriculumn", async () => {
    let res = "";
    try {
      await courses.assignCourseToCurriculum(
        "techComp",
        "TEST 001",
        "Curriculumn Test 1"
      );
    } catch (err) {
      res = err;
    }

    assert.equal(
      res,
      "Error: Course TEST 001 has already been added to Curriculumn Test 1!\n"
    );
  });

  it("returns an error that the course does not exist", async () => {
    let res = "";
    try {
      await courses.assignCourseToCurriculum(
        "techComp",
        "test 999",
        "Curriculumn Test"
      );
    } catch (err) {
      res = err;
    }

    assert.equal(res, "Error: Course test 999 does not exist!\n");
  });

  it("returns an error that the curriculumn does not exist", async () => {
    let res = "";
    try {
      await courses.assignCourseToCurriculum(
        "techComp",
        "ECSE 428",
        "just a test"
      );
    } catch (err) {
      res = err;
    }

    assert.equal(res, "Error: Curriculum just a test does not exist!\n");
  });

  it("returns true indicating the course has been assigned to the curriculum", async () => {
    const res = await courses.assignCourseToCurriculum(
      "techComp",
      "TEST 002",
      "Curriculumn Test 1"
    );

    assert.equal(true, res);
  });

  after(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(
      `DELETE FROM curriculum_tech_comps WHERE course_code = ?;`,
      ["TEST 001"]
    );
    await conn.query(
      `DELETE FROM curriculum_tech_comps WHERE course_code = ?;`,
      ["TEST 002"]
    );
    await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
      "TEST 001"
    ]);
    await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
      "TEST 002"
    ]);

    await conn.query(`DELETE FROM curriculums WHERE curriculum_name = ?;`, [
      "Curriculumn Test 1"
    ]);

    await conn.release();
  });
});
