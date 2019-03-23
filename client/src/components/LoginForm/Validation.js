// Student ID should only contain 9 numeric characters
export function isStudentId(id) {
  return !this.isEmpty(id) && /^\d+$/.test(id) && id.length === 9;
}

export function isEmpty(value) {
  return !value;
}

export function isPassword(password) {
  return (
    !this.isEmpty(password) && password.length >= 8 && password.length <= 64
  );
}

export function isEmail(email) {
  var validation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !this.isEmpty(email) && validation.test(String(email).toLowerCase());
}
