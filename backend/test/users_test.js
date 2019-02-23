const users = require("../logic/users/users.js");
const assert = require("assert");

//Helper method to check if an async function throws a given error.
async function assertThrowsAsync(fn, exception) {
  let f = () => {};
  try {
    await fn();
  } catch (error) {
    f = () => {
      throw error
    }
  } finally {
    assert.throws(f, exception)
  }
}

describe("Tests add student user", async function () {
  it("responds with invalid format username 10", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser(null, "password", "email@email.com", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Username cannot be empty")
  });

  it("responds with invalid format password", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser("username", null, "email@email.com", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Password cannot be empty")
  });

  it("responds with invalid format email", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser("username", "password", null, "123456789")
    } catch (error) {
      console.log(error.message)
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Email cannot be empty")
  });

  it("responds with invalid format id", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser("username", "password", "email@email.com", null)
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Id cannot be empty")
  });

  const expectedInvalidUsername = "invalid format username";
  it("responds with invalid format username 1", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser("usernameWithSymbols123%@^", "password", "email@email.com", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Username must be alphanumeric")
  });

  it("responds with invalid format username 3", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser(
        "RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase",
        "password",
        "email@email.com",
        "123456789"
      )
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Invalid format username, username must be less than or equal to 64 characters in length")
  });

  it("responds with invalid format password 1", async function () {
    let errorMessage = "no error"
    try {
      await users.insertStudentUser("username", "short", "email@email.com", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Invalid password format, password must be between 8 and 64 characters")
  });

  it("responds with invalid format password 2", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser(
        "username",
        "thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis",
        "email",
        "123456789"
      )
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, 'Invalid password format, password must be between 8 and 64 characters')
  });

  it("responds with invalid format email 1", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, 'Invalid email format')
  });

  it("responds with invalid format email 2", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email#@gma.com", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, 'Invalid email format')
  });

  it("responds with invalid format email 3", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email@g.c", "123456789")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Invalid email format")
  });

  it("responds with invalid format email 4", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser(
        "username",
        "password",
        "email.2.2.12@@gmai.test.com",
        "123456789"
      )
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Invalid email format")
  });

  it("responds with invalid format id 1", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email@email.com", "1234")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Id must be 9 characters long")
  });

  it("responds with invalid format id 2", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email@email.com", "1234ABDS2")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Id must be a number")
  });

  it("responds with invalid format id 3", async function () {
    let errorMessage = "no error"
    try {
      await users
      .insertStudentUser("username", "password", "email@email.com", "ab#%@a141")
    } catch (error) {
      errorMessage = error.message
    }
    assert.equal(errorMessage, "Id must be a number")
  });

  it("responds with true 1", function () {
    users
      .insertStudentUser(
        "username1",
        "password",
        "email@email.com",
        "123456789"
      )
      .then(response => {
        return new Promise(function (resolve) {
          assert.equal(response, "true");
          resolve();
        }).then(done);
      });
  });

  it("responds with true 2", function (done) {
    users
      .insertStudentUser(
        "username2",
        "passWITHsymbo!@#AOZ;]",
        "email@email.com",
        "234567890"
      )
      .then(response => {
        return new Promise(function (resolve) {
          assert.equal(response, "true");
          resolve();
        }).then(done);
      });
  });

  it("responds with true 3", function (done) {
    users
      .insertStudentUser(
        "username3",
        "ASlightlyLongerPasswordThanNormal",
        "I.Have.A.Really.Long.Email.Address@emailDomainToo.com",
        "535235231"
      )
      .then(response => {
        return new Promise(function (resolve) {
          assert.equal(response, "true");
          resolve();
        }).then(done);
      });
  });
});
