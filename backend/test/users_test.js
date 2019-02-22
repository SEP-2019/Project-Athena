const mocha = require("mocha");
const users = require("../logic/users/users.js");
const assert = require("assert");
const nock = require("nock");

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
    users
      .insertStudentUser(null, "password", "email@email.com", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "invalid format username");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format password", function(done) {
    users
      .insertStudentUser("username", null, "email@email.com", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "invalid format password");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email", function(done) {
    users
      .insertStudentUser("username", "password", null, "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "invalid format email");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", null)
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "invalid format id");
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidUsername = "invalid format username";
  it("responds with invalid format username 1", function(done) {
    users
      .insertStudentUser(
        "usernameWithSymbols123%@^",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format username 2", function(done) {
    users
      .insertStudentUser(
        "username123%@^",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidUsername);
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
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidUsername);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidPass = "invalid format password";
  it("responds with invalid format password 1", function(done) {
    users
      .insertStudentUser("username", "short", "email@email.com", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format password 2", function(done) {
    users
      .insertStudentUser(
        "username",
        "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis",
        "email",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidEmail = "invalid format email";
  it("responds with invalid format email 1", function(done) {
    users
      .insertStudentUser("username", "password", "email", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 2", function(done) {
    users
      .insertStudentUser("username", "password", "email#@gma.com", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 3", function(done) {
    users
      .insertStudentUser("username", "password", "email@g.c", "123456789")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 4", function(done) {
    users
      .insertStudentUser(
        "username",
        "password",
        "email.2.2.12@@gmai.test.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidId = "invalid format id";
  it("responds with invalid format id 1", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 2", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234ABDS2")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 3", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "ab#%@a141")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 1", function(done) {
    users
      .insertStudentUser(
        "username1",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "true");
          resolve();
        }).then(done);
      });
  });

  it("responds with true 2", function(done) {
    users
      .insertStudentUser(
        "username2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "234567890"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, "true");
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
          assert.equal(response, "true");
          resolve();
        }).then(done);
      });
  });
});

describe("Test retrieve student data", function() {
  it("responds with valid", function() {
    return users.getStudentData(2).then(function(res) {
      let found = false;
      let searchingFor = {
        major: [],
        minor: [],
        courses: [{ course_code: "ECSE 428", semester: "winter" }]
      };
      if (JSON.stringify(course) == JSON.stringify(searchingFor)) found = true;
      assert(true, found);
    });
  });
});
