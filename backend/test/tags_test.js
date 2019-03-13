const tags = require("../logic/tags/tags");
const assert = require("assert");
const mysql = require("../sql/connection");

describe("Tests adding and removing tags", function() {
  const expectedInvalidFormat = "invalid format tag";
  it("responds with invalid format tag on add", async () => {
    await tags.addTag(null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it("responds with invalid format tag on delete", async () => {
    await tags.removeTag(null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it("responds with true", async () => {
    before(async () => {
      await tags.addTag("some test tag").then(response => {
        assert.equal(response, true);
      });
    });

    after(async () => {
      await tags.removeTag("some test tag").then(response => {
        assert.equal(response, true);
      });
    });
  });
});

describe("Tests assigning tags to courses", function() {
  const expectedInvalidFormat = "invalid format tag";
  const tag1 = "some test tag 1";
  const tag2 = "some test tag 2";
  const course_code = "ECSE 589";
  const title = "Test title";
  const department = "ECSE";
  const phased_out = false;

  it("responds with invalid format tag", async () => {
    await tags.assignTagsToCourse("ECSE 589", null).catch(response => {
      assert.equal(response.message, expectedInvalidFormat);
    });
  });

  it("responds with false", async () => {
    await tags.assignTagsToCourse("ECSE 589", tag1).catch(response => {
      assert.equal(response.message, "false");
    });
  });

  it("responds with true", async () => {
    before(async () => {
      let connection = await mysql.getNewConnection();
      await connection.query(
        "INSERT IGNORE INTO courses WHERE " +
          "(course_code, title, department, phased_out) VALUES (?, ?, ?, ?);",
        [course_code, title, department, phased_out]
      );
      await connection.release();
      await tags.addTag(tag1);
      await tags.addTag(tag2);
      await tags.assignTagsToCourse(course_code, [tag1, tag2]);
    });

    after(async () => {
      let connection = await mysql.getNewConnection();
      await connection.query(
        "DELETE FROM courses WHERE course_code = ?;",
        course_code
      );
      await tags.removeTag(tag1);
      await tags.removeTag(tag2);
    });
  });
});
