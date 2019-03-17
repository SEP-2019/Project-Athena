const tags = require("../logic/tags/tags");
const assert = require("assert");
const mysql = require("../sql/connection");

const expectedFalse = "false";
const expectedTrue = true;

describe("Tests adding and removing tags", function() {
  const expectedInvalidFormat = "invalid format tag";
  it(`responds with ${expectedInvalidFormat}`, async () => {
    await tags.addTag(null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it(`responds with ${expectedInvalidFormat}`, async () => {
    await tags.removeTag(null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it(`responds with ${expectedTrue}`, async () => {
    await tags.addTag("some test tag").then(response => {
      assert.equal(response, expectedTrue);
    });

    await tags.removeTag("some test tag").then(response => {
      assert.equal(response, expectedTrue);
    });
  });
});

describe("Tests assigning tags to courses", function() {
  let connection;
  const expectedInvalidFormat = "invalid format tag";
  const tag1 = "some test tag 1";
  const tag2 = "some test tag 2";
  const tag3 = "some test tag 3";
  const course_code = "ECSE 589";
  const title = "Test title";
  const department = "ECSE";
  const phased_out = false;

  before(async () => {
    await tags.removeTag(tag1);
    await tags.removeTag(tag2);
    await tags.addTag(tag1);
    await tags.addTag(tag2);
    connection = await mysql.getNewConnection();
    await connection.query(
      "INSERT IGNORE INTO courses " +
        "(course_code, title, department, phased_out, description) VALUES (?, ?, ?, ?, ?);",
      [course_code, title, department, phased_out, ""]
    );
  });

  it(`responds with ${expectedInvalidFormat}`, async () => {
    await tags.assignTagsToCourse(course_code, null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it(`responds with ${expectedInvalidFormat}`, async () => {
    await tags.assignTagsToCourse(course_code, [tag1, null]).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it(`responds with ${expectedFalse}`, async () => {
    await tags.assignTagsToCourse(course_code, [tag3]).catch(response => {
      assert.equal(response.message, expectedFalse);
    });
  });

  it(`responds with ${expectedTrue}`, async () => {
    await tags.assignTagsToCourse(course_code, [tag1, tag2]).then(response => {
      assert.equal(response, expectedTrue);
    });
  });

  after(async () => {
    await tags.removeTag(tag1);
    await tags.removeTag(tag2);
    await connection.query(
      "DELETE FROM courses WHERE course_code = ?;",
      course_code
    );
    await connection.release();
  });
});
