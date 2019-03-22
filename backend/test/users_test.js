const mocha = require("mocha");
const users = require("../logic/users/users.js");
const courses = require("../logic/courses/courses.js");
const curriculums = require("../logic/curriculums/curriculums.js")
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
const expectedTrue = true;

describe("Tests add student user", function() {
  it(`responds with ${expectedUsernameNotEmpty}`, function(done) {
    users
      .insertStudentUser(null, "password", "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedUsernameNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedPasswordNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", null, "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "Password cannot be empty");
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedEmailNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", "password", null, "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedEmailNotEmpty);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNotEmpty}`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", null)
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
      .insertStudentUser(
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
      .insertStudentUser(
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
      .insertStudentUser("username", "short", "email@email.com", "123456789")
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
      .insertStudentUser("username", "password", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email#@gma.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedInvalidEmail} 3`, function(done) {
    users
      .insertStudentUser("username", "password", "email@g.c", "123456789")
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
        "123456789"
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
      .insertStudentUser("username", "password", "email@email.com", "1234")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidIdLength);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 1`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234ABDS2")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
          resolve();
        }).then(done);
      });
  });

  it(`responds with ${expectedIdNumeric} 2`, function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "ab#%@a141")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedIdNumeric);
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
        "222222222"
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
      .insertStudentUser(
        "username2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "234567890"
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
      .insertStudentUser(
        "username3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainToo.com",
        "535235231"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedTrue);
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
      260561054
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
   * Major: Electrical Engineering-2018-2019-8-semester-curriculum
   * Minor: Software Engineering Minor-2015-2016-1-semester-curriculum
   * Completed Courses: ECSE 276 (<-coreq->) ECSE 279, ECSE 379 (prereq ECSE279)
   * Incomplete Core classes: ECSE 479 (prereq ECSE 379)
   * Incomplete Minor classes: ECSE 199
   * Incomplete complementary: ANTH 299
   * Desired TC: COMP 499
   * 
   * Question --> why IncompletedCoreClass + desiredTC have a semester associated to them? (see getStudentData Route)
   */
  // initialize test data:

  // Student User
  username = "MathieuTest";
  password = "Mat123!@#";
  email = "mat.test@mcgill.ca";
  student_id = "192837465";

  // Courses
  // ECSE 276 (Coreq with ECSE 279)
  courseCode_1 = "ECSE 276";
  title_1 = "Software Design";
  ecseDepartment = "ECSE";
  notPhasedOut = 0;
  description_1 = "Software design and intro on automation testing";
  credits_3 = 3;
  // ECSE 279 (Coreq with ECSE 276)
  courseCode_2 = "ECSE 279";
  title_2 = "Software Unit Test 1";
  description_2 = "Test automation continuation";
  // ECSE 379 - prereq ECSE 279
  courseCode_3 = "ECSE 379";
  title_3 = "Software Unit Test 2";
  description_3 = "Test the integrity of varioud dependent functions";
  // ECSE 479 (prereq ECSE 379)
  courseCode_4 = "ECSE 479";
  title_4 = "Deployement Methodologies";
  description_4 = "Learning deployement methodologies and practices";
  // ECSE 499
  courseCode_5 = "COMP 499";
  compDepartment = "COMP";
  title_5 = "Software Techical Complementary";
  description_5 = "Threads and more";
  // ANTH 299
  courseCode_6 = "ANTH 299";
  anthDepartment = "ANTH";
  title_6 = "Anthropology development";
  description_6 = "Anthropology focused on societies";
  // ECSE 199
  courseCode_7 = "ECSE 199";
  title_7 = "Software minor for Electrical";
  description_7  = "Software Stuff";

  // Course Offering
  courseOffering = {
    "ECSE 276": [
      {
        id: 11276,
        semester: "W2018",
        section: 1,
        scheduled_time: "M 8:35-09:25 T 8:35-09:25 F 8:35-09:25"
      }
    ],
    "ECSE 279": [
      {
        id: 11279,
        semester: "W2018",
        section: 1,
        scheduled_time: "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05"
      }
    ],
    "ECSE 379": [
      {
        id: 22379,
        semester: "W2018",
        section: 1,
        scheduled_time: "W 10:05-13:05 W 16:05-17:05"
      }
    ],
    "ECSE 479": [
      {
        id: 33479,
        semester: "F2019",
        section: 1,
        scheduled_time: "W 10:05-13:05 W 16:05-17:05"
      }
    ],
    "ECSE 499": [
      {
        id: 44499,
        semester: "F2019",
        section: 1,
        scheduled_time: "M 8:35-09:25 T 8:35-09:25 F 8:35-09:25"
      }
    ],
    "ANTH 299": [
      {
        id: 5299,
        semester: "F2019",
        section: 1,
        scheduled_time: "M 11:05-12:55 F 11:05-12:55"
      }
    ],
    "ECSE 199": [
      {
        id: 1199,
        semester: "F2020",
        section: 1,
        scheduled_time: "M 11:05-12:55 F 11:05-12:55"
      }
    ]
  };
  // Student course Offering
  completedCourses = {
    "ECSE 276": [{"semester": "W2018", "section": 1}],
    "ECSE 279": [{"semester": "W2018", "section": 1}],
    "ECSE 379": [{"semester": "W2018", "section": 1}]
  };
  // Prereqs
  prereqs = {
    "ECSE 379": ["ECSE 279"],
    "ECSE 479": ["ECSE 379"]
  };
  // Coreqs
  coreqs = {
    "ECSE 276": ["ECSE 279"]
  };
  //Student Desired Courses (COMP 499)
  desiredCourses = ["COMP 499"];
  // Curriculum
  majorCurriculumName = "Electrical Engineering Major-2015-2016-8-semester-curriculum";
  majorCurriculumType = "Major";
  majorDepartment = "Electrical Engineer"
  majorNumOfElectives = 1;
  majorCores = ["ECSE 276", "ECSE 279", "ECSE 379", "ECSE 479"];
  majorTechComps = ["COMP 499"];
  majorComps = ["ANTH 299"];

  minorCurriculumName = "Software Engineering Minor-2015-2016-1-semester-curriculum";
  minorCurriculumType = "Minor";
  minorDepartment = "Software Engineer"
  minorNumOfElectives = 0;
  minorCore = "ECSE 199";
  //minorTechComps = ["COMP 499"];
  //minorComps = ["ANTH 299"];

  // curriculum_core_classes / curriculum_tech_comps / curriculum_complementaries
  // student_majors

  // student_minors
  

  before(async () => {
    // users - students
    await users.insertStudentUser (username, password, email, student_id);
    // courses
    await courses.addCourse(courseCode_1, title_1, ecseDepartment, notPhasedOut, description_1, credits_3);
    await courses.addCourse(courseCode_2, title_2, ecseDepartment, notPhasedOut, description_2, credits_3);
    await courses.addCourse(courseCode_3, title_3, ecseDepartment, notPhasedOut, description_3, credits_3);
    await courses.addCourse(courseCode_4, title_4, ecseDepartment, notPhasedOut, description_4, credits_3);
    await courses.addCourse(courseCode_5, title_5, compDepartment, notPhasedOut, description_5, credits_3);
    await courses.addCourse(courseCode_6, title_6, anthDepartment, notPhasedOut, description_6, credits_3);
    await courses.addCourse(courseCode_7, title_7, ecseDepartment, notPhasedOut, description_7, credits_3);
    // course_offering
    await courses.addCourseOfferings(courseOffering);
    // student_course_offering (or use courses.addCompletedCourses())
    await courses.addCompletedCourses(student_id, completedCourses);
    // course_prereqs
    await courses.addPrereq(prereqs);
    // course_coreqs
    await courses.addCoreq(coreqs);
    // student_desired_courses
    await courses.saveUserPreferences(student_id, desiredCourses);
    // curriculums / curriculum_core_classes / curriculum_tech_comps / curriculum_complementaries
    await curriculums.createCurriculum (majorCurriculumName, majorCurriculumType, majorDepartment, majorNumOfElectives, majorCores, majorTechComps, majorComps);
    await conn.query(`INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);`,
    [minorCurriculumName, minorCurriculumType, minorDepartment, minorNumOfElectives]);
    await conn.query("INSERT INTO curriculum_core_classes (curriculum_name, course_code) VALUES(?, ?);",
    [minorCurriculumName, minorCore]);
    // student_majors
    await conn.query("INSERT INTO student_majors (student_id, curriculum_name) VALUES(?, ?);",
    [student_id, majorCurriculumName]);
    // student_minors
    await conn.query("INSERT INTO student_minors (student_id, curriculum_name) VALUES(?, ?);",
    [student_id, minorCurriculumName]);
  });


  // --- TESTS ---


  after(async () => {
    // student_minors
    await conn.query(`DELETE FROM student_minors WHERE student_id = ?;`,[student_id]);
    // student_majors
    await conn.query(`DELETE FROM student_majors WHERE student_id = ?;`,[student_id]);
    // curriculums / curriculum_core_classes / curriculum_tech_comps / curriculum_complementaries
    await conn.query(`DELETE FROM curriculum_core_classes WHERE curriculum_name = ?;`,[minorCurriculumName]);
    await conn.query(`DELETE FROM curriculums WHERE curriculum_name = ?;`,[minorCurriculumName]);

    await conn.query(`DELETE FROM curriculum_complementaries WHERE curriculum_name = ?;`,[majorCurriculumName]);
    await conn.query(`DELETE FROM curriculum_tech_comps WHERE curriculum_name = ?;`,[majorCurriculumName]);
    await conn.query(`DELETE FROM curriculum_core_classes WHERE curriculum_name = ?;`,[majorCurriculumName]);
    await conn.query(`DELETE FROM curriculums WHERE curriculum_name = ?;`,[majorCurriculumName]);
    // student_desired_courses
    await conn.query(`DELETE FROM student_desired_courses WHERE student_id = ?;`,[student_id]);
    // course_coreqs
    await conn.query(`DELETE FROM course_coreqs WHERE course_code = ?;`, ["ECSE 276"]);
    //await conn.query(`DELETE FROM course_coreqs WHERE course_code = ?;`, ["ECSE 279"]); (not sure if needed)
    // course_prereqs
    await conn.query(`DELETE FROM course_prereqs WHERE course_code = ?;`, ["ECSE 379"]);
    await conn.query(`DELETE FROM course_prereqs WHERE course_code = ?;`, ["ECSE 479"]);
    // student_course_offering
    await conn.query(`DELETE FROM student_course_offerings WHERE student_id = ?;`, [student_id]);
    // course_offerings
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [11276]);
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [11279]);
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [22379]);
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [33479]);
    await conn.query(`DELETE FROM course_offerings WHERE id = ?;`, [44499]);
    // courses
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_1]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_2]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_3]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_4]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_5]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_6]
    );
    await conn.query(
      `DELETE FROM courses WHERE course_code = ?;`,
      [courseCode_7]
    );
    // users - students
    await users.deleteStudentUser(username);
  });
});

