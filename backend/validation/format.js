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

function isAlphabet(str) {
	if (!str)
		return false
	return String(str).match(/^[a-z]+$/i);
}

function isNumeric(str) {
	if (!str)
		return false
	return String(str).match(/^[0-9]*$/);
}

exports.verifyUsername = username => {
	if (!username)
		return false
	if (String(username).length > MAX_USERNAME_LENGTH) {
		return false;
	}
	return isAlphanumeric(username);
}

exports.verifyPassword = password => {
	if (!password)
		return false
	if (String(password).length > MAX_PASSWORD_LENGTH || String(password).length < MIN_PASSWORD_LENGTH) {
		return false;
	}
	return true;
}

exports.verifyEmail = email => {
	if (!email)
		return false
	if (String(email).length > MAX_EMAIL_LENGTH) {
		return false;
	}
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

exports.verifyId = id => {
	if (!id)
		return false
	return (isNumeric(id) && (String(id).length == ID_LENGTH));
}

exports.verifyCourseCode = courseCode => {
	// Odd example: ISLA 522D2 
	var department = courseCode.substring(0, 4);
	var space = courseCode.charAt(5);
	var cousreNumber = courseCode.split(space, 2);
	courseNumber = courseNumber[1];
	if(!courseCode)
		return false
	return (isAlphabet(department) && space == " " && isAlphanumeric(courseNumber));
	
}