// Student ID should only contain 9 numeric characters
export function isStudentId(id) {
  return this.isEmpty(id) || !/^\d+$/.test(id) || id.length !== 9;
}

export function isEmpty(value) {
  return !value;
}

export function setError(message) {
  document.getElementById('error-msg').innerHTML = message;
}

export function checkPassword(password) {
  return password.length < 8 || password.length > 64;
}

export function checkLoginError(error) {
  return (
    error === 'Password length must be between 8 and 64' ||
    error === 'User does not exist' ||
    error === 'Username length must be less than 64' ||
    error === 'Username must be alphanumeric' ||
    error === 'Incorrect username or password.'
  );
}
