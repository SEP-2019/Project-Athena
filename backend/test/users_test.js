const mocha = require("mocha");
const users = require("../logic/users/users.js");
const courses = require("../logic/courses/courses.js");
const curriculums = require("../logic/curriculums/curriculums.js");
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
const expectedCurriculumYearLength4 =
  "Curriculum year must be an integer of length 4";
const expectedNonExistentUser = "User does not exist";
const expectedIncorrectPassword = "Incorrect username or password.";

const expectedTrue = true;

describe("Tests add student user", function() {
  it(`responds with ${expectedUsernameNotEmpty}`, function(done) {
    users
      .insertStudentUser(
        null,
        "password",
        "email@email.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPasswordNotEmpty}`, function(done) {
    users
      .insertStudentUser(
        "username",
        null,
        "email@email.com",
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "Password cannot be empty");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedEmailNotEmpty}`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        null,
        "123456789",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedEmailNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNotEmpty}`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        null,
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
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
      .insertStudentUser(
        "username",
        "short",
        "email@email.com",
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
      .insertStudentUser(
        "username",
        "password",
        "email",
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

  it(`responds with ${expectedInvalidEmail} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email#@gma.com",
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

  it(`responds with ${expectedInvalidEmail} 3`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@g.c",
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
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "1234",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidIdLength);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "1234ABDS2",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "ab#%@a141",
        "Software Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 1`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        null,
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumNameEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "Software Engineering",
        "2017",
        null
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumNameEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 1`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "####%%% Engineering",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumAlphanumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "Software Engineering",
        "2017",
        "**##$%%^ curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumAlphanumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumYearLength4} 1`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "Software Engineering",
        "111",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedCurriculumYearLength4);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedCurriculumYearLength4} 2`, function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "Software Engineering",
        "111111",
        "7-semester-curriculum"
      )
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
      .insertStudentUser(
        "username",
        "password",
        "email@email.com",
        "222222222",
        "Liberal Arts",
        "2017",
        "7-semester-curriculum"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(
            response.message,
            `Curriculum with name ${major} does not exist!`
          );
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 1`, function(done) {
    users
      .insertStudentUser(
        "username1",
        "password",
        "email@email.com",
        "222222222",
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
          assert.equal(
            response,
            "I.Have.A.Really.Long.Email.Address@emailDomainToo.com"
          );
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
    users
      .insertAdminUser(null, "password", "email@email.com", "1235219")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPasswordNotEmpty}`, function(done) {
    users
      .insertAdminUser("username", null, "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedPasswordNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedEmailNotEmpty}`, function(done) {
    users
      .insertAdminUser("username", "password", null, "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedEmailNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNotEmpty}`, function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", null)
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidUsername} 1`, function(done) {
    users
      .insertAdminUser(
        "usernameWithSymbols123%@^",
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

  it(`responds with ${expectedInvalidUsername} 2`, function(done) {
    users
      .insertAdminUser(
        "username123%@^",
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
    users
      .insertAdminUser("username", "short", "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedPassword8To64);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPassword8To64} 2`, function(done) {
    users
      .insertAdminUser(
        "username",
        "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis",
        "email",
        "123456789"
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
      .insertAdminUser("username", "password", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 2`, function(done) {
    users
      .insertAdminUser("username", "password", "email#@gma.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 3`, function(done) {
    users
      .insertAdminUser("username", "password", "email@g.c", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 4`, function(done) {
    users
      .insertAdminUser(
        "username",
        "password",
        "email.2.2.12@@gmai.test.com",
        "1234569235"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "12 3 4")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "1234ABDS2")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 3`, function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "ab#%@a141")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdSmallerThanMax}`, function(done) {
    users
      .insertAdminUser(
        "username",
        "password",
        "email@email.com",
        "1523982350342"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdSmallerThanMax);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 1`, function(done) {
    users
      .insertAdminUser(
        "adminusername1",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedTrue);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedTrue} 2`, function(done) {
    users
      .insertAdminUser(
        "adminusername2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "23453"
      )
      .then(response => {
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
    await courses.addCourse(
      "TEST 001",
      "Get completed Course Test",
      "TEST",
      "0",
      "TEST",
      3
    );

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
    await conn.query(
      `DELETE FROM student_course_offerings WHERE student_id = ?;`,
      [260561054]
    );
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [940915]);
    await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
      "TEST 001"
    ]);
    await users.deleteStudentUser("getCompletedCourseTest");

    await conn.release();
  });

  it("returns student completed course as JSON", async () => {
    const expected = { course_code: "TEST 001", semester: "W2017" };
    const res = await users.getCompletedCourses(260561054);

    assert.equal(JSON.stringify(expected), JSON.stringify(res[0]));
  });
});

describe("Test get student's data", () => {
  /**
   * Student 1:
   * Major: TEST Electrical Engineering-2018-2019-8-semester-curriculum
   * Minor: TEST Software Engineering Minor-2015-2016-1-semester-curriculum
   * Completed Courses: ECSE 276 (<-coreq->) ECSE 279, ECSE 379 (prereq ECSE279)
   * Incomplete Core classes: ECSE 479 (prereq ECSE 379)
   * Incomplete complementary:
   * Desired TC:
   */

  // Student User
  student_id = "111117465";

  // Coreqs
  coreqs = {
    "ECSE 276": ["ECSE 279"]
  };
  //Student Desired Courses (COMP 499)
  desiredCourses = ["COMP 499"];
  // Curriculum
  majorCurriculumName =
    "TEST Electrical Engineering Major-2015-2016-8-semester-curriculum";
  minorCurriculumName =
    "TEST Software Engineering Minor-2015-2016-1-semester-curriculum";

  before(async () => {
    // users - students
    await conn.query(`INSERT INTO users (username, email, password) VALUES
    ('MatTESTER', 'mat111.test111@mcgill.ca', 'Mat!@#111'),
    ('noDataTESTER', 'noData11@hotmail.com', 'noData123!@#');`);
    await conn.query(`INSERT INTO students (student_id, username) VALUES
    ('111117465', 'MatTESTER'),
    ('101010101', 'noDataTESTER');`);
    // courses
    await conn.query(`INSERT INTO courses (course_code, title, department, phased_out, description, credits) VALUES
    ('ECSE 276', 'Software Design', 'ECSE', '0', 'Software design and intro on automation testing', '3'),
    ('ECSE 279', 'Software Unit Test 1', 'ECSE', '0', 'Test automation continuation', '3'),
    ('ECSE 379', 'Software Unit Test 2', 'ECSE', '0', 'Test the integrity of varioud dependent functions', '3'),
    ('ECSE 479', 'Deployement Methodologies', 'ECSE', '0', 'Learning deployement methodologies and practices', '3'),
    ('COMP 499', 'Software Techical Complementary', 'COMP', '0', 'Threads and more', '3'),
    ('ANTH 299', 'Anthropology development', 'ANTH', '0', 'Anthropology focused on societies', '3'),
    ('ECSE 199', 'Software minor for Electrical', 'ECSE', '0', 'Software Stuff', '3');`);
    // course_offering
    await conn.query(`INSERT INTO course_offerings (id, semester, scheduled_time, course_code, section) VALUES
    ('11276', 'W2018', 'M 8:35-09:25 T 8:35-09:25 F 8:35-09:25',  'ECSE 276', '1'),
    ('11279', 'W2018', 'M 10:05-13:35 T 10:35-11:35 F 14:05-16:05',  'ECSE 279', '1'),
    ('22379', 'W2018', 'W 10:05-13:05 W 16:05-17:05',  'ECSE 379', '1'),
    ('33479', 'F2015', 'W 10:05-13:05 W 16:05-17:05',  'ECSE 479', '1'),
    ('44499', 'F2015', 'M 8:35-09:25 T 8:35-09:25 F 8:35-09:25',  'COMP 499', '1'),
    ('5299', 'F2015', 'M 11:05-12:55 F 11:05-12:55',  'ANTH 299', '1'),
    ('1199', 'F2015', 'M 11:05-12:55 F 11:05-12:55',  'ECSE 199', '1');`);
    // student_course_offering
    await conn.query(`INSERT INTO student_course_offerings (student_id, offering_id, semester) VALUES
    ('111117465', '11276', 'W2018'),
    ('111117465', '11279', 'W2018'),
    ('111117465', '22379', 'W2018');`);
    // course_prereqs
    await conn.query(`INSERT INTO course_prereqs (course_code, prereq_course_code) VALUES
    ('ECSE 379', 'ECSE 279'),
    ('ECSE 479', 'ECSE 379');`);
    // course_coreqs
    await courses.addCoreq(coreqs);
    // student_desired_courses
    await courses.saveUserPreferences(student_id, desiredCourses);
    // curriculums / curriculum_core_classes / curriculum_tech_comps / curriculum_complementaries
    await conn.query(`INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'Major', 'ee', '1'),
    ('TEST Software Engineering Minor-2015-2016-1-semester-curriculum', 'Minor', 'se', '0');`);
    await conn.query(`INSERT INTO curriculum_core_classes (curriculum_name, course_code) VALUES
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'ECSE 276'),
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'ECSE 279'),
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'ECSE 379'),
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'ECSE 479'),
    ('TEST Software Engineering Minor-2015-2016-1-semester-curriculum', 'ECSE 199');`);
    await conn.query(`INSERT INTO curriculum_tech_comps (curriculum_name, course_code) VALUES
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'COMP 499');`);
    await conn.query(`INSERT INTO curriculum_complementaries (curriculum_name, course_code) VALUES
    ('TEST Electrical Engineering Major-2015-2016-8-semester-curriculum', 'ANTH 299');`);
    // student_majors
    await conn.query(
      "INSERT INTO student_majors (student_id, curriculum_name) VALUES(?, ?);",
      [student_id, majorCurriculumName]
    );
    // student_minors
    await conn.query(
      "INSERT INTO student_minors (student_id, curriculum_name) VALUES(?, ?);",
      [student_id, minorCurriculumName]
    );
  });

  it("responds with true indicating that the student data was obtained", async () => {
    const expectedMajor =
      "TEST Electrical Engineering Major-2015-2016-8-semester-curriculum";
    const expectedMinor =
      "TEST Software Engineering Minor-2015-2016-1-semester-curriculum";
    const expectedCompletedCourse_1 = "ECSE 276";
    const expectedCompletedCourse_2 = "ECSE 279";
    const expectedCompletedCourse_3 = "ECSE 379";
    const expectedCompletedSemester = "W2018";
    const expectedIncompleted = [];
    const expectedDesired = [];

    var res = await users.getStudentData(student_id);
    res = JSON.stringify(res);
    res = JSON.parse(res);

    assert.equal(expectedMajor, res.major[0].curriculum_name);
    assert.equal(expectedMinor, res.minor[0].curriculum_name);
    assert.equal(
      expectedCompletedCourse_1,
      res.completedCourses[0].course_code
    );
    assert.equal(expectedCompletedSemester, res.completedCourses[0].semester);
    assert.equal(
      expectedCompletedCourse_2,
      res.completedCourses[1].course_code
    );
    assert.equal(expectedCompletedSemester, res.completedCourses[1].semester);
    assert.equal(
      expectedCompletedCourse_3,
      res.completedCourses[2].course_code
    );
    assert.equal(expectedCompletedSemester, res.completedCourses[2].semester);
    assert.equal(expectedIncompleted[0], res.incompletedCore[0]);
    assert.equal(expectedDesired[0], res.desiredTC[0]);
  });

  it("responds false with the student having no majors", async () => {
    const expected = "Error: Student does not have any majors";
    try {
      await users.getStudentData(student_id);
    } catch (err) {
      res = err;
      assert.equal(res, expected);
    }
  });

  after(async () => {
    // student_minors
    await conn.query(`DELETE FROM student_minors WHERE student_id = ?;`, [
      student_id
    ]);
    // student_majors
    await conn.query(`DELETE FROM student_majors WHERE student_id = ?;`, [
      student_id
    ]);
    // curriculums / curriculum_core_classes / curriculum_tech_comps / curriculum_complementaries
    await conn.query(
      `DELETE FROM curriculum_complementaries WHERE curriculum_name = ?;`,
      [majorCurriculumName]
    );
    await conn.query(
      `DELETE FROM curriculum_tech_comps WHERE curriculum_name = ?;`,
      [majorCurriculumName]
    );
    await conn.query(`DELETE FROM curriculum_core_classes WHERE curriculum_name IN 
    ('TEST Software Engineering Minor-2015-2016-1-semester-curriculum', 'TEST Electrical Engineering Major-2015-2016-8-semester-curriculum');`);
    await conn.query(`DELETE FROM curriculums WHERE curriculum_name IN 
    ('TEST Software Engineering Minor-2015-2016-1-semester-curriculum', 'TEST Electrical Engineering Major-2015-2016-8-semester-curriculum');`);
    // student_desired_courses
    await conn.query(
      `DELETE FROM student_desired_courses WHERE student_id = ?;`,
      [student_id]
    );
    // course_coreqs
    await conn.query(`DELETE FROM course_coreqs WHERE course_code = ?;`, [
      "ECSE 276"
    ]);
    // course_prereqs
    await conn.query(`DELETE FROM course_prereqs WHERE course_code IN 
    ('ECSE 379', 'ECSE 479');`);
    // student_course_offering
    await conn.query(
      `DELETE FROM student_course_offerings WHERE student_id = ?;`,
      [student_id]
    );
    // course_offerings
    await conn.query(`DELETE FROM course_offerings WHERE id IN 
    ('11276', '11279', '22379', '33479', '44499', '5299', '1199');`);
    // courses
    await conn.query(`DELETE FROM courses WHERE course_code IN 
    ('ECSE 276', 'ECSE 279', 'ECSE 379', 'ECSE 479', 'COMP 499', 'ANTH 299', 'ECSE 199');`);
    // users - students
    await conn.query(`DELETE FROM students WHERE student_id IN 
    ('111117465', '101010101');`);

    await conn.query(`DELETE FROM users WHERE username IN 
    ('MatTESTER', 'noDataTESTER');`);
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
    await users.assignStudentMinor(
      "260678627",
      "Electrical Engineering|2015|2016|7-semester-curriculum"
    );

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(
      `SELECT * FROM student_minors WHERE student_id = ?;`,
      ["260678627"]
    );
    assert.equal(assigned[0].student_id, "260678627");
    assert.equal(
      assigned[0].curriculum_name,
      "Electrical Engineering|2015|2016|7-semester-curriculum"
    );
    conn.release();
  });
  it("ensures student is updated to be assigned to new minor", async () => {
    await users.assignStudentMinor(
      "260678627",
      "Software Engineering|2017|2018|7-semester-curriculum"
    );
    await users.assignStudentMinor(
      "260678627",
      "Electrical Engineering|2015|2016|7-semester-curriculum"
    );

    let conn = await mysql.getNewConnection();
    let assigned = await conn.query(
      `SELECT * FROM student_minors WHERE student_id = ?;`,
      ["260678627"]
    );
    assert.equal(assigned[0].student_id, "260678627");
    assert.equal(
      assigned[0].curriculum_name,
      "Electrical Engineering|2015|2016|7-semester-curriculum"
    );
    conn.release();
  });
  it(`responds with ${expectedIdNumeric}`, async () => {
    try {
      await users.assignStudentMinor(
        "ABCDEFG",
        "Electrical Engineering|2015|2016|7-semester-curriculum"
      );
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
      await users.assignStudentMinor(
        "100000000",
        "Electrical Engineering|2015|2016|7-semester-curriculum"
      );
    } catch (error) {
      assert.equal(error.message, `Student user with student ID 100000000 does not exist!`);
    }
  });
  it("responds with curriculum does not exist", async () => {
    try {
      await users.assignStudentMinor(
        "260678627",
        "Electrical Engineering|2015|2016|10-semester-curriculum"
      );
    } catch (error) {
      assert.equal(error.message, `Curriculum with name Electrical Engineering|2015|2016|10-semester-curriculum does not exist!`);
    }
  });
  it("responds with student is already assigned to minor", async () => {
    await users.assignStudentMinor(
      "260678627",
      "Electrical Engineering|2015|2016|7-semester-curriculum"
    );
    try {
      await users.assignStudentMinor(
        "260678627",
        "Electrical Engineering|2015|2016|7-semester-curriculum"
      );
    } catch (error) {
      assert.equal(error.message, `Student is already assigned to Electrical Engineering|2015|2016|7-semester-curriculum as a minor`);
    }
  });
  after(async () => {
    const conn = await mysql.getNewConnection();

    await conn.query(`DELETE FROM student_minors WHERE student_id = ?;`, [
      "260678627"
    ]);
    await users.deleteStudentUser("TESTMINOR");
    await conn.release();
  });
});

describe("Testing Login", () => {
  let username = "team";
  let password = "primus1234";
  let email = "testing@gmail.com";
  let studentId = 250502459;
  let program = "Software Engineering";
  let year = "2017";
  let curr_type = "7-semester-curriculum";

  before(async () => {
    await users.insertStudentUser(
      username,
      password,
      email,
      studentId,
      program,
      year,
      curr_type
    );
  });

  it(`Null username responds with ${expectedUsernameNotEmpty}`, function(done) {
    users.login(null, password).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedUsernameNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`Empty username responds with ${expectedUsernameNotEmpty}`, function(done) {
    users.login("", password).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedUsernameNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`Empty password responds with ${expectedPasswordNotEmpty}`, function(done) {
    users.login(username, "").catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedPasswordNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`Null password responds with ${expectedPasswordNotEmpty}`, function(done) {
    users.login(username, null).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedPasswordNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`Empty fields responds with ${expectedUsernameNotEmpty}`, function(done) {
    users.login(null, null).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedUsernameNotEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`Non existing Username responds with ${expectedNonExistentUser}`, function(done) {
    users.login("teamm", password).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedNonExistentUser);
        resolve();
      }).then(done);
    });
  });

  it(`Incorrect Password responds with ${expectedIncorrectPassword}`, function(done) {
    users.login(username, "primus123456789").catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedIncorrectPassword);
        resolve();
      }).then(done);
    });
  });

  it(`Random symbol username responds with ${expectedInvalidUsername}`, function(done) {
    users.login("team!$", password).catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedInvalidUsername);
        resolve();
      }).then(done);
    });
  });

  it(`Long username greater than 64 length responds with ${expectedUsernameLessThan64}`, function(done) {
    users
      .login(
        "teammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
        password
      )
      .catch(error => {
        return new Promise(function(resolve) {
          assert.equal(error.message, expectedUsernameLessThan64);
          resolve();
        }).then(done);
      });
  });

  it(`Short password less than 8 responds wth ${expectedPassword8To64}`, function(done) {
    users.login(username, "primus").catch(error => {
      return new Promise(function(resolve) {
        assert.equal(error.message, expectedPassword8To64);
        resolve();
      }).then(done);
    });
  });

  it(`Long password greater than 64 responds wth ${expectedPassword8To64}`, function(done) {
    users
      .login(
        username,
        "teammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
      )
      .catch(error => {
        return new Promise(function(resolve) {
          assert.equal(error.message, expectedPassword8To64);
          resolve();
        }).then(done);
      });
  });

  it(`Successful login responds with user email: ${email}`, function(done) {
    users.login(username, password).then(response => {
      return new Promise(function(resolve) {
        assert.equal(response, email);
        resolve();
      }).then(done);
    });
  });

  after(async () => {
    await users.deleteStudentUser("team");
  });
});

describe("Update student Major", () => {
  let username = "testuser1";
  let password = "primus1234";
  let email = "testing100@gmail.com";
  let studentId = 250502400;
  let program = "Software Engineering";
  let year = "2017";
  let curr_type = "7-semester-curriculum";

  before(async () => {
    await users.insertStudentUser(username, password, email, studentId, "Electrical Engineering", 2015, "7-semester-curriculum");
  });

  it(`responds with ${expectedInvalidIdLength}`, function(done) {
    users.updateStudentMajor("1234", program, year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedInvalidIdLength);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users.updateStudentMajor("1234ABDS2", program, year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users.updateStudentMajor("ab#%@a141", program, year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedIdNumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 1`, function(done) {
    users.updateStudentMajor(studentId, null, year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumNameEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumNameEmpty} 2`, function(done) {
    users.updateStudentMajor(studentId, program, year, null).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumNameEmpty);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 1`, function(done) {
    users.updateStudentMajor(studentId, "####%%% Engineering", year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumAlphanumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumAlphanumeric} 2`, function(done) {
    users.updateStudentMajor(studentId, program, year, "**##$%%^ curriculum").catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumAlphanumeric);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumYearLength4} 1`, function(done) {
    users.updateStudentMajor(studentId, program, "111", curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumYearLength4);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedCurriculumYearLength4} 2`, function(done) {
    users.updateStudentMajor(studentId, program, "111111", curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, expectedCurriculumYearLength4);
        resolve();
      }).then(done);
    });
  });

  it(`responds with curriculum does not exist 1`, function(done) {
    let major = "Liberal Arts|2017|2018|7-semester-curriculum";
    users.updateStudentMajor(studentId, "Liberal Arts", year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, `Curriculum with name ${major} does not exist!`);
        resolve();
      }).then(done);
    });
  });

  it(`responds with user does not exist 1`, function(done) {
    let test_id = 299999999;
    users.updateStudentMajor(test_id, program, year, curr_type).catch(response => {
      return new Promise(function(resolve) {
        assert.equal(response.message, `Student user with student ID ${test_id} does not exist!`);
        resolve();
      }).then(done);
    });
  });

  it(`responds with ${expectedTrue} 1`, async () => {
    let response = await users.updateStudentMajor(studentId, program, year, curr_type);
    let results = await users.getStudentData(studentId);
    let nextYear = (parseInt(year, 10) + 1).toString(10);
    let major = results.major[0].curriculum_name;
    assert.equal(major, program.concat("|", year, "|", nextYear, "|", curr_type));
    assert.equal(response, expectedTrue);
  });

  after(async () => {
    await users.deleteStudentUser(username);
  });
});
