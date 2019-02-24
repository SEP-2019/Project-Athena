const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const ID_LENGTH = 9;
const DEPARTMENT_LENGTH = 4;

//todo throw error on failure of format methods 

function isAlphanumeric(str) {
	if (!str)
		return false
	return String(str).match(/^[a-z0-9]+$/i);
}

/**
 * Verifies that the input only contains alphabet values
 * @param {string} str
 */
function isAlphabet(str) {
	if (!str) {
		return false
	}
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

//exports.verifyCourseCode = courseCode => {
/**
 * Verifies that the course code is in the following format: XXXX 123
 * @param {String} courseCode
 */
var verifyCourseCode = async courseCode => {
	if (!/^[a-z]{4} \d{3}$/i.test(courseCode)) {
		return false;
	}
	return true;
}

/**
 * Verifies that the department is in the following format: XXXX
 * @param {String} courseCode
 */
var verifyDepartment = async department => {
	if (!department){
		return false;
	}
	return (String(department).length == DEPARTMENT_LENGTH && isAlphabet(department));
}

/**
 * Verifies that the phased_out is either 0 or 1
 * @param {String} phaseOut
 */
var verifyPhaseOut = async phaseOut => {
	if (phaseOut === undefined || phaseOut === null){	
		console.log('format location FALSE' + phaseOut);
		return false;
	}
	console.log('format location TRUE ' + phaseOut);
	return (phaseOut === 0 || phaseOut === 1);
}

module.exports = {
	verifyCourseCode,
	verifyDepartment,
	verifyPhaseOut
};