const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const ID_LENGTH = 9;

//todo throw error on failure of format methods 

function isAlphanumeric(str) {
	if (!str)
		return false
	return String(str).match(/^[a-z0-9]+$/i);
}

function isNumeric(str) {
	if (!str)
		return false
	return String(str).match(/^[0-9]*$/);
}

exports.verifyUsername = username => {
	if (!username) {
		throw invalidInputException("Username cannot be empty")
	}
	if (String(username).length > MAX_USERNAME_LENGTH) {
		throw invalidInputException(`Invalid format username, username must be less than or equal to ${MAX_USERNAME_LENGTH} characters in length`)
	}
	if(!isAlphanumeric(username)){
		throw invalidInputException('Username must be alphanumeric')
	}
	return true;
}

exports.verifyPassword = password => {
	if (!password) {
		throw invalidInputException('Password cannot be empty')
	}
	if (String(password).length > MAX_PASSWORD_LENGTH || String(password).length < MIN_PASSWORD_LENGTH) {
		throw invalidInputException(`Invalid password format, password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`)
	}
	return true;
}

exports.verifyEmail = email => {
	if (!email)
		throw invalidInputException('Email cannot be empty')
	if (String(email).length > MAX_EMAIL_LENGTH) {
		throw invalidInputException(`Email cannot be more than ${MAX_EMAIL_LENGTH} characters long`)
	}
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		throw invalidInputException('Invalid email format')
	}
	return true;
}

exports.verifyId = id => {
	if (!id)
		throw invalidInputException('Id cannot be empty')
	if(!isNumeric(id))
		throw invalidInputException('Id must be a number')
	if(String(id).length != ID_LENGTH)
		throw invalidInputException(`Id must be ${ID_LENGTH} characters long`)
	return true
}

exports.verifyStudentUserInput = (username, password, email, id) => {
	return(exports.verifyUsername(username) && exports.verifyPassword(password) && exports.verifyEmail(email) && exports.verifyId(id))
}

var invalidInputException = (message) => {
	let err = new Error(message);
	err.code = 400
	return err
};