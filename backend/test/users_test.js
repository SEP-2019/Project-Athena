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
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format username");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format password", function(done) {
    users
      .insertStudentUser("username", null, "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format password");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email", function(done) {
    users
      .insertStudentUser("username", "password", null, "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format email");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", null)
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format id");
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
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidUsername);
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
      .catch(response => {
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
    users
      .insertStudentUser("username", "short", "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
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
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidEmail = "invalid format email";
  it("responds with invalid format email 1", function(done) {
    users
      .insertStudentUser("username", "password", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 2", function(done) {
    users
      .insertStudentUser("username", "password", "email#@gma.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 3", function(done) {
    users
      .insertStudentUser("username", "password", "email@g.c", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
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
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidId = "invalid format id";
  it("responds with invalid format id 1", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 2", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "1234ABDS2")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      })
  });

  it("responds with invalid format id 3", function(done) {
    users
      .insertStudentUser("username", "password", "email@email.com", "ab#%@a141")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
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
        "222222222"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
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
    users
      .deleteStudentUser("username1")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 5", function(done) {
    users
      .deleteStudentUser("username2")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 6", function(done) {
    users
      .deleteStudentUser("username3")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

});

describe("Tests add admin user", function() {
  it("responds with invalid format username", function(done) {
    users
      .insertAdminUser(null, "password", "email@email.com", "1235219")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format username");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format password", function(done) {
    users
      .insertAdminUser("username", null, "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format password");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email", function(done) {
    users
      .insertAdminUser("username", "password", null, "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format email");
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id", function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", null)
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, "invalid format id");
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidUsername = "invalid format username";
  it("responds with invalid format username 1", function(done) {
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

  it("responds with invalid format username 2", function(done) {
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
    users
      .insertAdminUser("username", "short", "email@email.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format password 2", function(done) {
    users
      .insertAdminUser(
        "username",
        "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis",
        "email",
        "123456789"
      )
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidPass);
          resolve();
        }).then(done);
      });
  });

  const expectedInvalidEmail = "invalid format email";
  it("responds with invalid format email 1", function(done) {
    users
      .insertAdminUser("username", "password", "email", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 2", function(done) {
    users
      .insertAdminUser("username", "password", "email#@gma.com", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 3", function(done) {
    users
      .insertAdminUser("username", "password", "email@g.c", "123456789")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidEmail);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format email 4", function(done) {
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

  const expectedInvalidId = "invalid format id";
  it("responds with invalid format id 1", function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "12 3 4")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 2", function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "1234ABDS2")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 3", function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "ab#%@a141")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with invalid format id 4", function(done) {
    users
      .insertAdminUser("username", "password", "email@email.com", "1523982350342")
      .catch(response => {
        return new Promise(function(resolve) {
          assert.equal(response.message, expectedInvalidId);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 1", function(done) {
    users
      .insertAdminUser(
        "adminusername1",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 2", function(done) {
    users
      .insertAdminUser(
        "adminusername2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "23453"
      )
      .then(response => {
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
    users
      .deleteAdminUser("adminusername1")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 5", function(done) {
    users
      .deleteAdminUser("adminusername2")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });

  it("responds with true 6", function(done) {
    users
      .deleteAdminUser("adminusername3")
      .then(response => {
        return new Promise(function(resolve) {
          assert.equal(response, true);
          resolve();
        }).then(done);
      });
  });
});
