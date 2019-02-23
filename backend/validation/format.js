const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const ID_LENGTH = 9;
const MAX_ID = 2147483647;

//todo throw error on failure of format methods 

function isAlphanumeric(str) {
  if (!str) {
    return false;
  }
  return String(str).match(/^[a-z0-9]+$/i);
}

function isNumeric(str) {
  if (!str) {
    return false;
  }
  return String(str).match(/^[0-9]*$/);
}

var verifyUsername = username => {
  if (!username ||
    String(username).length > MAX_USERNAME_LENGTH) {
    return false;
  }
  return isAlphanumeric(username);
}

var verifyPassword = password => {
  if (!password ||
    String(password).length > MAX_PASSWORD_LENGTH ||
    String(password).length < MIN_PASSWORD_LENGTH) {
    return false;
  }
  return true;
}

var verifyEmail = email => {
  if (!email || String(email).length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

var verifyStudentId = id => {
  if (!id) {
    return false;
  }
  return (isNumeric(id) && (String(id).length == ID_LENGTH));
}

var verifyAdminId = id => {
  if (!id || !isNumeric(id) || id > MAX_ID) {
    return false;
  }
  return true;
}

module.exports = {
  verifyUsername,
  verifyPassword,
  verifyEmail,
  verifyStudentId,
  verifyAdminId
};
