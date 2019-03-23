const mocha = require("mocha");
const users = require("../logic/users/users.js");
const courses = require("../logic/courses/courses");
const curriculums = require("../logic/curriculums/curriculums");
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

const expectedUsernameNotEmpty = "Username cannot be empty";
const expectedPasswordNotEmpty = "Password cannot be empty";
const expectedEmailNotEmpty = "Email cannot be empty";
const expectedIdNotEmpty = "Id cannot be empty";
const expectedInvalidUsername = "Username must be alphanumeric";
const expectedUsernameLessThan64 = "Username length must be less than 64";
const expectedPassword8To64 = "Password length must be between 8 and 64";
const expectedInvalidEmail = "Invalid email format";
const expectedInvalidIdLength = "Id length must be 9";
const expectedIdNumeric = "Id must be numeric";
const expectedIdSmallerThanMax = "Id too large";
const expectedCurriculumNameEmpty = "Curriculum name cannot be empty";
const expectedCurriculumAlphanumeric = "Curriculum name must be alphanumeric";
const expectedCurriculumYearLength4 = "Curriculum year must be an integer of length 4";
const expectedTrue = true;

describe("Tests add student user", function() {
  it(`responds with ${expectedUsernameNotEmpty}`, function(done) {
    users
      .insertStudentUser(null, "password", "email@email.com", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPasswordNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", null, "email@email.com", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "Password cannot be empty");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedEmailNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", "password", null, "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedEmailNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", null, "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidUsername} 1`, function(done) {
    users
      .insertStudentUser(
        "usernameWithSymbols123%@^",
        "password",
        "email@email.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidUsername} 2`, function(done) {
    users
      .insertStudentUser(
        "username123%@^",
        "password",
        "email@email.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedUsernameLessThan64}`, function(done) {
    users
      .insertStudentUser(
        "RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase",
        "password",
        "email@email.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameLessThan64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPassword8To64} 1`, function(done) {
    users
      .insertStudentUser("username", "short", "email@email.com", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedPassword8To64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPassword8To64} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis",
        "email",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedPassword8To64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email#@gma.com", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 3`, function(done) {
    users
      .insertStudentUser("username", "password", "email@g.c", "123456789", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 4`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email.2.2.12@@gmai.test.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidIdLength}`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidIdLength);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234ABDS2", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "ab#%@a141", "Software Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", null, "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumNameEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "Software Engineering", "2017", null)
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumNameEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "####%%% Engineering", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumAlphanumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "Software Engineering", "2017", "**##$%%^ curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumAlphanumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumYearLength4} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "Software Engineering", "111", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumYearLength4);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumYearLength4} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "Software Engineering", "111111", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumYearLength4);
          resolve();
        }).then(done);
      });
  });

  it(`responds with curriculum does not exist 1`, function(done) {
    let major = "Liberal Arts|2017|2018|7-semester-curriculum";
    users
      .insertStudentUser("username", "password", "email@email.com", "222222222", "Liberal Arts", "2017", "7-semester-curriculum")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, `Curriculum with name ${major} does not exist!`);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 1`, function(done) {
    users
      .insertStudentUser("username1", "password", "email@email.com", "222222222", "Software Engineering", "2017", "7-semester-curriculum")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "email@email.com");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 2`, function(done) {
    users
      .insertStudentUser(
        "username2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "234567890",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "email@email.com");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 3`, function(done) {
    users
      .insertStudentUser(
        "username3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainToo.com",
        "535235231",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "I.Have.A.Really.Long.Email.Address@emailDomainToo.com");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 4`, function(done) {
    users.deleteStudentUser("username1").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 5`, function(done) {
    users.deleteStudentUser("username2").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 6`, function(done) {
    users.deleteStudentUser("username3").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });
});

describe("Tests add admin user", function() {
  it(`responds with ${expectedUsernameNotEmpty}`, function(done) {
    users.insertAdminUser(null, "password", "email@email.com", "1235219").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedUsernameNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedPasswordNotEmpty}`, function(done) {
    users.insertAdminUser("username", null, "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedPasswordNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedEmailNotEmpty}`, function(done) {
    users.insertAdminUser("username", "password", null, "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedEmailNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNotEmpty}`, function(done) {
    users.insertAdminUser("username", "password", "email@email.com", null).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedInvalidUsername} 1`, function(done) {
    users.insertAdminUser("usernameWithSymbols123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedInvalidUsername} 2`, function(done) {
    users.insertAdminUser("username123%@^", "password", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedUsernameLessThan64}`, function(done) {
    users
      .insertAdminUser(
        "RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase",
        "password",
        "email@email.com",
        "123456789"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameLessThan64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPassword8To64} 1`, function(done) {
    users.insertAdminUser("username", "short", "email@email.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedPassword8To64);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedPassword8To64} 2`, function(done) {
    users
      .insertAdminUser("username", "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedPassword8To64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 1`, function(done) {
    users.insertAdminUser("username", "password", "email", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedInvalidEmail} 2`, function(done) {
    users.insertAdminUser("username", "password", "email#@gma.com", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedInvalidEmail} 3`, function(done) {
    users.insertAdminUser("username", "password", "email@g.c", "123456789").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedInvalidEmail} 4`, function(done) {
    users.insertAdminUser("username", "password", "email.2.2.12@@gmai.test.com", "1234569235").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidEmail);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "12 3 4").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "1234ABDS2").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNumeric} 3`, function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "ab#%@a141").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdSmallerThanMax}`, function(done) {
    users.insertAdminUser("username", "password", "email@email.com", "1523982350342").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdSmallerThanMax);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 1`, function(done) {
    users.insertAdminUser("adminusername1", "password", "email@email.com", "123456789").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 2`, function(done) {
    users.insertAdminUser("adminusername2", "passWITHsymbo!@#AOZ;]", "email@email.com", "23453").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 3`, function(done) {
    users
      .insertAdminUser(
        "adminusername3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainTooIsllllooooooonnnnnnnngggggggggg.com",
        "5351"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedTrue);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 4`, function(done) {
    users.deleteAdminUser("adminusername1").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 5`, function(done) {
    users.deleteAdminUser("adminusername2").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 6`, function(done) {
    users.deleteAdminUser("adminusername3").then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, expectedTrue);
        resolve();
      }).then(done);
    });
  });
});

// TODO: Rewrite test for retrieving student data
// describe("Test retrieve student data", function() {
//   it("responds with valid", async function() {
//     connection = await mysql.getNewConnection();
//     await connection.query(
//       `INSERT INTO courses (course_code,title, department) VALUES (?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,
//       ["ECSE 428", "Software engineering in practice", "ECSE"]
//     );
//     await connection.query(
//       `INSERT INTO course_offerings (id, scheduled_time, semester, course_code, section) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id;`,
//       [321123, "MWF", "winter", "ECSE 428", "001"]
//     );
//     await connection.query(
//       `INSERT INTO users (username,email, password) VALUES (?,?,?) ON DUPLICATE KEY UPDATE username=username;`,
//       ["testUser", "email@domain.com", 12345678]
//     );
//     await connection.query(
//       `INSERT INTO students (student_id,username) VALUES (?,?) ON DUPLICATE KEY UPDATE student_id=student_id;`,
//       [123321123, "testUser"]
//     );
//     await connection.query(
//       `INSERT INTO student_course_offerings (student_id,offering_id,semester) VALUES (?,?,?);`,
//       [123321123, 321123, "winter"]
//     );
//     return users.getStudentData(123321123).then(function(res) {
//       let found = false;
//       let searchingFor = {
//         major: [],
//         minor: [],
//         courses: [{ course_code: "ECSE 428", semester: "winter" }]
//       };
//       if (JSON.stringify(res) == JSON.stringify(searchingFor)) {
//         found = true;
//       }
//       assert(true, found);
//     });
//   });
// });

describe("Test get student completed courses", () => {
  // initialize test data
  before(async () => {
    await courses.addCourse("TEST 001", "Get completed Course Test", "TEST", "0", "TEST", 3);

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

    await users.insertStudentUser(
      "getCompletedCourseTest",
      "getCompletedCourseTest",
      "getCompletedCourseTest@email.com",
      260561054,
      "Software Engineering",
      "2017",
      "7-semester-curriculum"
    );

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
    const expected = { course_code: "TEST 001", semester: "W2017" };
    const res = await users.getCompletedCourses(260561054);

    assert.equal(JSON.stringify(expected), JSON.stringify(res[0]));
  });
});

describe("Tests assign student a minor", () => {
  before(async () => {
    await users.insertStudentUser(
      "TESTMINOR",
      "password123",
      "dummy@hotmail.com",
      "260678627",
      "Software Engineering",
      "2017",
      "7-semester-curriculum"
    );
  });
  it("ensures student is assigned to minor", async () => {
    await users.assignStudentMinor("260678627", "Electrical Engineering|2015|2016|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_minors WHERE student_id = ?;`, ["260678627"]);
    assert.equal(assigned[0].student_id, "260678627");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2015|2016|7-semester-curriculum");
    conn.release();
  });
  it("ensures student is updated to be assigned to new minor", async () => {
    await users.assignStudentMinor("260678627", "Software Engineering|2017|2018|7-semester-curriculum");
    await users.assignStudentMinor("260678627", "Electrical Engineering|2015|2016|7-semester-curriculum");

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(`SELECT * FROM student_minors WHERE student_id = ?;`, ["260678627"]);
    assert.equal(assigned[0].student_id, "260678627");
    assert.equal(assigned[0].curriculum_name, "Electrical Engineering|2015|2016|7-semester-curriculum");
    conn.release();
  });
  it("responds with {expectedIdNumeric}", async () => {
    try {
      await users.assignStudentMinor("ABCDEFG", "Electrical Engineering|2015|2016|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, expectedIdNumeric);
    }
  });
  it("responds with curriculum name cannot be empty", async () => {
    try {
      await users.assignStudentMinor("260678627", null);
    } catch (error) {
      assert.equal(error.message, "Curriculum name cannot be empty");
    }
  });
  it("responds with student id does not exist", async () => {
    try {
      await users.assignStudentMinor("100000000", "Electrical Engineering|2015|2016|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student user with student ID 100000000 does not exist!\n`);
    }
  });
  it("responds with curriculum does not exist", async () => {
    try {
      await users.assignStudentMinor("260678627", "Electrical Engineering|2015|2016|10-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Curriculum with name Electrical Engineering|2015|2016|10-semester-curriculum does not exist!\n`);
    }
  });
  it("responds with student is already assigned to minor", async () => {
    await users.assignStudentMinor("260678627", "Electrical Engineering|2015|2016|7-semester-curriculum");
    try {
      await users.assignStudentMinor("260678627", "Electrical Engineering|2015|2016|7-semester-curriculum");
    } catch (error) {
      assert.equal(error.message, `Student is already assigned to Electrical Engineering|2015|2016|7-semester-curriculum as a minor\n`);
    }
  });
  after(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(`DELETE FROM student_minors WHERE student_id = ?;`, ["260678627"]);
    await users.deleteStudentUser("TESTMINOR");
    await conn.release();
  });
});
