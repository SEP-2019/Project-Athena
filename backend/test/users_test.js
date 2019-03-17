const mocha = require("mocha");
const users = require("../logic/users/users.js");
const courses = require("../logic/courses/courses");
const assert = require("assert");
const nock = require("nock");
const mysql = require("../sql/connection");
const expect = require("chai").expect;

/*
const host = 'http://localhost:3000';
const addStudentURL = '/users/addStudentUser';

describe('POST /users/addStudentUser', function() {
	it('responds with undefined username', function() {
		nock(host)
			.post(addStudentURL, {'password': 'password',
			                      'email': 'email@email.com',
			                      'student_id': '123456789'})
			.reply(200, 'undefined username');	
	});

	it('responds with undefined password', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			               'email': 'email@email.com',
			               'student_id': '123456789'})
			.reply(200, 'undefined password');
	});

	it('responds with undefined email', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			                      'password': 'password',
			                      'student_id': '123456789'})
			.reply(200, 'undefined email');
	});

	it('responds with undefined id', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			                      'password': 'password',
			                      'student_id': '123456789'})
			.reply(200, 'undefined id');
	});
});
*/

describe("Tests add student user", function() {
  it("responds with invalid format username", function(done) {
    users.insertStudentUser(null, "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format username");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format password", function(done) {
    users.insertStudentUser("username", null, "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format password");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email", function(done) {
    users.insertStudentUser("username", "password", null, "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format email");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id", function(done) {
    users.insertStudentUser("username", "password", "email@email.com", null).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format id");
        resolve();
      }).then(done);
    });
  });

  const expectedInvalidUsername = "invalid format username";
  it("responds with invalid format username 1", function(done) {
    users.insertStudentUser("usernameWithSymbols123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format username 2", function(done) {
    users.insertStudentUser("username123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format username 3", function(done) {
    users
      .insertStudentUser(
        "RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase",
        "password",
        "email@email.com",
        "123456789"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidPass = "invalid format password";
  it("responds with invalid format password 1", function(done) {
    users.insertStudentUser("username", "short", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidPass);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format password 2", function(done) {
    users
      .insertStudentUser("username", "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidEmail = "invalid format email";
  it("responds with invalid format email 1", function(done) {
    users.insertStudentUser("username", "password", "email", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 2", function(done) {
    users.insertStudentUser("username", "password", "email#@gma.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 3", function(done) {
    users.insertStudentUser("username", "password", "email@g.c", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 4", function(done) {
    users.insertStudentUser("username", "password", "email.2.2.12@@gmai.test.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  const expectedInvalidId = "invalid format id";
  it("responds with invalid format id 1", function(done) {
    users.insertStudentUser("username", "password", "email@email.com", "1234").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id 2", function(done) {
    users.insertStudentUser("username", "password", "email@email.com", "1234ABDS2").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id 3", function(done) {
    users.insertStudentUser("username", "password", "email@email.com", "ab#%@a141").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 1", function(done) {
    users.insertStudentUser("username1", "password", "email@email.com", "222222222").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 2", function(done) {
    users.insertStudentUser("username2", "passWITHsymbo!@#AOZ;]", "email@email.com", "234567890").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 3", function(done) {
    users
      .insertStudentUser(
        "username3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainToo.com",
        "535235231"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 4", function(done) {
    users.deleteStudentUser("username1").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 5", function(done) {
    users.deleteStudentUser("username2").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 6", function(done) {
    users.deleteStudentUser("username3").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });
});

describe("Tests add admin user", function() {
  it("responds with invalid format username", function(done) {
    users.insertAdminUser(null, "password", "email@email.com", "1235219").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format username");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format password", function(done) {
    users.insertAdminUser("username", null, "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format password");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email", function(done) {
    users.insertAdminUser("username", "password", null, "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format email");
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id", function(done) {
    users.insertAdminUser("username", "password", "email@email.com", null).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, "invalid format id");
        resolve();
      }).then(done);
    });
  });

  const expectedInvalidUsername = "invalid format username";
  it("responds with invalid format username 1", function(done) {
    users.insertAdminUser("usernameWithSymbols123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format username 2", function(done) {
    users.insertAdminUser("username123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format username 3", function(done) {
    users
      .insertAdminUser(
        "RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase",
        "password",
        "email@email.com",
        "123456789"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidPass = "invalid format password";
  it("responds with invalid format password 1", function(done) {
    users.insertAdminUser("username", "short", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidPass);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format password 2", function(done) {
    users
      .insertAdminUser("username", "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidEmail = "invalid format email";
  it("responds with invalid format email 1", function(done) {
    users.insertAdminUser("username", "password", "email", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 2", function(done) {
    users.insertAdminUser("username", "password", "email#@gma.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 3", function(done) {
    users.insertAdminUser("username", "password", "email@g.c", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format email 4", function(done) {
    users.insertAdminUser("username", "password", "email.2.2.12@@gmai.test.com", "1234569235").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  const expectedInvalidId = "invalid format id";
  it("responds with invalid format id 1", function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "12 3 4").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id 2", function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "1234ABDS2").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id 3", function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "ab#%@a141").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with invalid format id 4", function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "1523982350342").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidId);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 1", function(done) {
    users.insertAdminUser("adminusername1", "password", "email@email.com", "123456789").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 2", function(done) {
    users.insertAdminUser("adminusername2", "passWITHsymbo!@#AOZ;]", "email@email.com", "23453").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 3", function(done) {
    users
      .insertAdminUser(
        "adminusername3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainTooIsllllooooooonnnnnnnngggggggggg.com",
        "5351"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 4", function(done) {
    users.deleteAdminUser("adminusername1").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 5", function(done) {
    users.deleteAdminUser("adminusername2").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });

  it("responds with true 6", function(done) {
    users.deleteAdminUser("adminusername3").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, true);
        resolve();
      }).then(done);
    });
  });
});

describe("Test retrieve student data", () => {
  it("responds with valid", async () => {
    connection = await mysql.getNewConnection();
    await connection.query(
      `INSERT INTO courses (course_code,title, department) VALUES (?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,
      ["ECSE 428", "Software engineering in practice", "ECSE"]
    );
    await connection.query(
      `INSERT INTO course_offerings (id, scheduled_time, semester, course_code, section) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id;`,
      [321123, "MWF", "winter", "ECSE 428", "001"]
    );
    await connection.query(`INSERT INTO users (username,email, password) VALUES (?,?,?) ON DUPLICATE KEY UPDATE username=username;`, [
      "testUser",
      "email@domain.com",
      12345678
    ]);
    await connection.query(`INSERT INTO students (student_id,username) VALUES (?,?) ON DUPLICATE KEY UPDATE student_id=student_id;`, [
      123321123,
      "testUser"
    ]);
    await connection.query(`INSERT INTO student_course_offerings (student_id,offering_id,semester) VALUES (?,?,?);`, [
      123321123,
      321123,
      "winter"
    ]);
    await connection.release();
    return users.getStudentData(123321123).then(function(res) {
      let found = false;
      let searchingFor = {
        major: [],
        minor: [],
        courses: [{ course_code: "ECSE 428", semester: "winter" }]
      };
      if (JSON.stringify(res) == JSON.stringify(searchingFor)) {
        found = true;
      }
      assert(true, found);
    });
  });
});

describe("Test get student completed courses", () => {
  // initialize test data
  before(async () => {
    await courses.addCourse("TEST 001", "Get completed Course Test", "TEST", "0");

    const courseOffering = {
      "TEST 001": [
        {
          id: 940915,
          semester: "W2017",
          section: 1,
          scheduled_time: "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05"
        }
      ]
    };
    await courses.addCourseOfferings(courseOffering);

    await users.insertStudentUser("getCompletedCourseTest", "getCompletedCourseTest", "getCompletedCourseTest@email.com", 260561054);

    const conn = await mysql.getNewConnection();
    await conn.query(
      `INSERT INTO student_course_offerings (student_id, offering_id, semester)
    VALUES(?, ?, ?);`,
      [260561054, 940915, "W2017"]
    );

    await conn.release();
  });

  // clean up test data
  after(async () => {
    const conn = await mysql.getNewConnection();
    await conn.query(`DELETE FROM student_course_offerings WHERE student_id = ?;`, [260561054]);
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [940915]);
    await conn.query(`DELETE FROM courses WHERE course_code = ?;`, ["TEST 001"]);
    await users.deleteStudentUser("getCompletedCourseTest");

    await conn.release();
  });

  it("returns student completed course as JSON", async () => {
    const expected = [{ course_code: "TEST 001", semester: "W2017" }];
    const res = await users.getCompletedCourses(260561054);

    assert.equal(JSON.stringify(expected), res);
  });
});

describe("Tests assign student a major", () => {
  it("ensures student is assigned to major", async () => {
    await users.assignStudentMajor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_majors WHERE student_id = ?;`, ["123321123"]);
    assert.equal(assigned[0].student_id, "123321123");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2014|2015|7-semester-curriculum");
    conn.release();
  });
  it("ensures student is updated to be assigned to new major", async () => {
    await users.assignStudentMajor("123321123", "Software Engineering|2016|2017|7-semester-curriculum");
    await users.assignStudentMajor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_majors WHERE student_id = ?;`, ["123321123"]);
    assert.equal(assigned[0].student_id, "123321123");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2014|2015|7-semester-curriculum");
    conn.release();
  });
  it("responds with invalid student id", async () => {
    try {
      await users.assignStudentMajor("ABCDEFG", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, "Invalid student id");
    }
  });
  it("responds with invalid curriculum name", async () => {
    try {
      await users.assignStudentMajor("260678626", null);
    } catch (error) {
      assert.equal(error.message, "Invalid curriculum name");
    }
  });
  it("responds with student id does not exist", async () => {
    try {
      await users.assignStudentMajor("260678626", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student user with student ID 260678626 does not exist!\n`);
    }
  });
  it("responds with curriculum does not exist", async () => {
    try {
      await users.assignStudentMajor("123321123", "Electrical Engineering|2014|2015|10-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Curriculum with name Electrical Engineering|2014|2015|10-semester-curriculum does not exist!\n`);
    }
  });
  it("responds with student is already assigned to major", async () => {
    await users.assignStudentMajor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");
    try {
      await users.assignStudentMajor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student is already assigned to Electrical Engineering|2014|2015|7-semester-curriculum as a major\n`);
    }
  });
  after(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(`DELETE FROM student_majors WHERE student_id = ?;`, ["123321123"]);

    await conn.release();
  });
});

describe("Tests assign student a minor", () => {
  it("ensures student is assigned to minor", async () => {
    await users.assignStudentMinor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_minors WHERE student_id = ?;`, ["123321123"]);
    assert.equal(assigned[0].student_id, "123321123");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2014|2015|7-semester-curriculum");
    conn.release();
  });
  it("ensures student is updated to be assigned to new minor", async () => {
    await users.assignStudentMinor("123321123", "Software Engineering|2016|2017|7-semester-curriculum");
    await users.assignStudentMinor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_minors WHERE student_id = ?;`, ["123321123"]);
    assert.equal(assigned[0].student_id, "123321123");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2014|2015|7-semester-curriculum");
    conn.release();
  });
  it("responds with invalid student id", async () => {
    try {
      await users.assignStudentMinor("ABCDEFG", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, "Invalid student id");
    }
  });
  it("responds with invalid curriculum name", async () => {
    try {
      await users.assignStudentMinor("260678626", null);
    } catch (error) {
      assert.equal(error.message, "Invalid curriculum name");
    }
  });
  it("responds with student id does not exist", async () => {
    try {
      await users.assignStudentMinor("260678626", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student user with student ID 260678626 does not exist!\n`);
    }
  });
  it("responds with curriculum does not exist", async () => {
    try {
      await users.assignStudentMinor("123321123", "Electrical Engineering|2014|2015|10-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Curriculum with name Electrical Engineering|2014|2015|10-semester-curriculum does not exist!\n`);
    }
  });
  it("responds with student is already assigned to minor", async () => {
    await users.assignStudentMinor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");
    try {
      await users.assignStudentMinor("123321123", "Electrical Engineering|2014|2015|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student is already assigned to Electrical Engineering|2014|2015|7-semester-curriculum as a minor\n`);
    }
  });
  after(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(`DELETE FROM student_majors WHERE student_id = ?;`, ["123321123"]);

    await conn.release();
  });
});
