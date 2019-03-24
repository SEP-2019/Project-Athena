const courses = require("../logic/courses/courses.js");
const users = require("../logic/users/users.js");
const assert = require("assert");
const mysql = require("../sql/connection");

describe("Test retrieve course by tag", function() {
  before(async () => {
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
    await users.insertStudentUser(
      "getCourseByTagTest",
      "getCourseByTagTest",
      "getCourseByTagTest@email.com",
      260561055,
      "Software Engineering",
      "2017",
      "7-semester-curriculum"
    );
    await connection.query(
      `INSERT INTO student_desired_courses (course_code, student_id) VALUES
        (?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,
      ["ECSE 428", 260561055]
    );
    await connection.release();
  });

  it("responds with valid", async function() {
    return courses.getCourseByTag("Engineering", 260561055).then(function(res) {
      let found = false;
      let searchingFor = { course_code: "ECSE 428" };
      for (course in res) {
        if (JSON.stringify(course) == JSON.stringify(searchingFor))
          found = true;
      }
      assert(true, found);
    });
  });

  after(async () => {
    connection = await mysql.getNewConnection();
    await connection.query(
      `DELETE FROM student_desired_courses WHERE student_id = 260561055;`
    );
    await users.deleteStudentUser("getCourseByTagTest");
    await connection.release();
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
      "0",
      "TEST",
      3
    );

    await courses.addCourse(
      "TEST 002",
      "Assign Course to Curriculumn Test 002",
      "TEST",
      "0",
      "TEST",
      3
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

describe("Tests add student future desired courses", () => {
  username = "MathieuTest";
  password = "Mat123!@#";
  email = "mat.test@mcgill.ca";
  id = "192837465";
  program = "Software Engineering";
  year = "2017";
  curr_type = "7-semester-curriculum";

  invalid_id_1 = "260111111";
  invalid_id_2 = "26280x028";

  before(async () => {
    await users.insertStudentUser(
      username,
      password,
      email,
      id,
      program,
      year,
      curr_type
    );
  });

  it("responds with invalid format student id 1", async () => {
    courses
      .saveUserPreferences(null, ["ECSE 307", "ECSE 251", "ECSE 325"])
      .catch(response => {
        assert.equal(response.message, "Id cannot be empty");
      });
  });

  it("responds with invalid format student id 2", async () => {
    courses
      .saveUserPreferences(invalid_id_1, ["ECSE 307", "ECSE 251", "ECSE 325"])
      .catch(response => {
        assert.equal(response.message, "false");
      });
  });

  it("responds with invalid format student id 3", async () => {
    courses
      .saveUserPreferences(invalid_id_2, ["ECSE 307", "ECSE 251", "ECSE 325"])
      .catch(response => {
        assert.equal(response.message, "Id must be numeric");
      });
  });

  it("responds with invalid format course code 1", async () => {
    courses
      .saveUserPreferences(id, ["ECSE 999", "ECSE 251", "ECSE 325"])
      .catch(response => {
        assert.equal(response.message, "false");
      });
  });

  it("responds with invalid format course code 2", async () => {
    courses
      .saveUserPreferences(id, ["Z1Z2 L21", "ECSE 251", "ECSE 325"])
      .catch(response => {
        assert.equal(
          response.message,
          "Invalid format course code for course Z1Z2 L21"
        );
      });
  });

  it("responds with invalid format course code 3", async () => {
    courses.saveUserPreferences(id, null).catch(response => {
      assert.equal(response.message, "empty courses list");
    });
  });

  it("responds with true indicating student desired courses were properly added ", function(done) {
    courses.saveUserPreferences(id, ["ECSE 251", "ECSE 210"]).then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  after(async () => {
    await conn.query(
      `DELETE FROM student_desired_courses WHERE student_id = ?;`,
      [id]
    );
    await users.deleteStudentUser(username);
  });
});
