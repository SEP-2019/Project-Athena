const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const MAX_ID_LENGTH = 9;

function isAlphanumeric(str) {
	return str.match(/^[a-z0-9]+$/i);
}

function isNumeric(str){
	return str.match(/^([0-9]+)$/gm);
}

//makes sure id is numberic, when inserting, given characters mysql will simply insert default int which is unwanted
exports.verifyId = id => {
	if(!id){
		return false;
	}
	if (id.length > MAX_ID_LENGTH){
		return false;
	}
	return isNumeric(id);
}

exports.verifyUsername = username => {
	if (username.length > MAX_USERNAME_LENGTH) {
		return false;
	}
	return isAlphanumeric(username);
}

exports.verifyPassword = password => {
	if (password.length > MAX_PASSWORD_LENGTH || password.length < MIN_PASSWORD_LENGTH) {
		return false;
	}
	return true;
}

exports.verifyEmail = email => {
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
