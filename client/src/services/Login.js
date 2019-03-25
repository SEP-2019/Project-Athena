export const username = '111222333';
export const pwd = '12345678';
export const email = 'cc@cc.cc';

const tempAdmin = 'admin';
const tempPwd = '12345678';

export function checkResponse(response) {
  return response === email;
}

export function checkAdminUsername(id) {
  return id === tempAdmin;
}

export function checkAdminPassword(password) {
  return password === tempPwd;
}
