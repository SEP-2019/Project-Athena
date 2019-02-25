const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MAX_CURR_NAME_LENGTH = 128;
const MAX_DEPARTMENT_LENGTH = 256;
const MAX_DEPARTMENTSUBNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const ID_LENGTH = 9;
const MAX_ID = 2147483647;


/**
 * Verifies that the input only contains alphanumeric values
 * @param {string} str
 */
function isAlphanumeric(str) {
  if (!str) {
    return false;
  }
  return String(str).match(/^[a-z0-9]+$/i);
}

/**
 * Verifies that the input only contains either alphanumeric values or - or :
 * @param {string} str
 */
function isAlteredAlphanumeric(str) {
  if (!str) {
    return false;
  }
  return String(str).match(/^([a-z0-9]|[-]|[:])+$/i);
}

/**
 * Verifies that the input only contains numeric values
 * @param {string} str
 */
function isNumeric(str) {
  if (!str) {
    return false;
  }
  return String(str).match(/^[0-9]*$/);
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

/**
 * Verifies that the username only contains alphanumerical characters
 * @param {string} username
 */
var verifyUsername = username => {
  if (!username || String(username).length > MAX_USERNAME_LENGTH) {
    return false;
  }
  return isAlphanumeric(username);
};

/**
 * Verifies that the password is at least 8 characters and 64 characters in length
 * @param {string} password
 */
var verifyPassword = password => {
  if (
    !password ||
    String(password).length > MAX_PASSWORD_LENGTH ||
    String(password).length < MIN_PASSWORD_LENGTH
  ) {
    return false;
  }
  return true;
};

/**
 * Verifies if an email is valid or not.
 * @param {string} email
 */
var verifyEmail = email => {
  if (!email || String(email).length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

/**
 * Verifies that the student id is 9 digits long
 * @param {int} id
 */
var verifyStudentId = id => {
  if (!id) {
    return false;
  }
  return isNumeric(id) && String(id).length == ID_LENGTH;
};

/**
 * Verifies that the administrator id is smaller than 2^31 - 1 and is a number
 * @param {int} id
 */
var verifyAdminId = id => {
  if (!id || !isNumeric(id) || id > MAX_ID) {
    return false;
  }
  return true;
};

/**
 * Verifies that the curriculum name only contains alphanumerical characters
 * @param {string} curriculum
 */
var verifyCurriculumName = curriculum => {
  if (!curriculum || String(curriculum).length > MAX_CURR_NAME_LENGTH) {
    return false;
  }
  return isAlteredAlphanumeric(curriculum);
};

/**
 * Verifies that the curriculum type is major or minor
 * @param {string} type
 */
var verifyCurrType = type => {
  if (!(type.toUpperCase() === "MAJOR") && !(type.toUpperCase() === "MINOR")) {
    return false;
  }
  return true;
};

/**
 * Verifies that the department name only contains alphanumerical characters
 * @param {string} department
 */
var verifyDepartmentName = department => {
  if (!department || String(department).length > MAX_DEPARTMENT_LENGTH) {
    return false;
  }
  return isAlphanumeric(department);
};

/**
 * Verifies that the num of electives is numeric
 * @param {int} numOfElectives
 */
var verifyNumOfElectives = numOfElectives => {
  if (!id || !isNumeric(id)) {
    return false;
  }
  return true;
};

/**
 * Verifies that a list of courses is valid
 * @param {JSON} courses
 *       {
 *         "ECSE 428": [{"semester": "W2017", "section": 1}],
 *         "ECSE 356": [{"semester": "S2019", "section": 2}],
 *         "ECSE 422": [{"semester": "F2019", "section": 1},
 *                      {"semester": "W2018", "section": 3}]
 *       }
 */
var verifyCourse = async courses => {
  let error = "invalid format courses";
  for (let course in courses) {
    if (!isMcGillCourse(course)) {
      throw new Error(error);
    }

    courses[course].forEach(row => {
      if (!isMcGillSemester(row.semester) || !isNumeric(row.section)) {
        throw new Error(error);
      }
    });
  }
};

/**
 * Verifies that the course code is in the following format: XXXX 123
 * @param {String} courseCode
 */
function isMcGillCourse(courseCode) {
  if (!/^[a-z]{4} \d{3}$/i.test(courseCode)) {
    return false;
  }
  return true;
}

/**
 * Verifies that the semester is in the following format: {W|S|F}1234
 * @param {String} semester
 */
function isMcGillSemester(semester) {
  if (!/^[WSF]{1}\d{4}$/i.test(semester)) {
    return false;
  }
  return true;
}

/**
 * Verifies that a list of course offerings is valid
 * @param {JSON} courseOfferings
 *       {
 *         "ECSE 428": [{"id": 253, "semester": "W2017", "section": 1, "scheduled_time": "M 10:05-13:35 T 10:35-11:35 F 14:05-16:05", }]
 *         "ECSE 356": [{"id": 2758, "semester": "S2019", "section": 2, "scheduled_time": "W 10:05-13:05 W 16:05-17:05"}],
 *         "ECSE 422": [{"id": 25993, "semester": "F2019", "section": 1, "scheduled_time": "M 8:35-10:05 W 8:35-10:05"},
 *                      {"id": 25993, "semester": "W2018", "section": 3, "scheduled_time": "M 10:05-11:05 W 10:05-11:05 T 10:05-11:05"}]
 *       }
 */
var verifyCourseOffering = async courseOfferings => {
  let error = "invalid format course offerings";
  for (let course in courseOfferings) {
    if (!isMcGillCourse(course)) {
      throw new Error(error);
    }

    courseOfferings[course].forEach(row => {
      if (
        !isNumeric(row.id) ||
        !isMcGillSemester(row.semester) ||
        !isNumeric(row.section)
      ) {
        throw new Error(error);
      }
    });
  }
};

/**
 * Verifies that a list of course corequisistes is valid
 * @param {JSON} coreqs
 *        {
 *          "ECSE 428": ["ECSE 321"],
 *          "MATH 270": ["MATH 140", "MATH 240"]
 *        }
 */
var verifyCoreq = async coreqs => {
  let error = "invalid format coreq";
  for (let course in coreqs) {
    if (!isMcGillCourse(course)) {
      throw new Error(error);
    }

    coreqs[course].forEach(coreqCourse => {
      if (!isMcGillCourse(coreqCourse)) {
        throw new Error(error);
      }
    });
  }
};

/**
 * Verifies that a list of course prerequisites is valid
 * @param {JSON} prereq
 *        {
 *          "ECSE 428": ["ECSE 321"],
 *          "MATH 270": ["MATH 140", "MATH 240"]
 *        }
 */
var verifyPrereq = async prereqs => {
  let error = "invalid format prereq";
  for (let course in prereqs) {
    if (!isMcGillCourse(course)) {
      throw new Error(error);
    }

    prereqs[course].forEach(prereqCourse => {
      if (!isMcGillCourse(prereqCourse)) {
        throw new Error(error);
      }
    });
  }
};

/**
 * Verifies if the course code is valid
 * @param {string} courseCode
 */
var verifyCourseCode = async courseCode => {
  if (!isMcGillCourse(courseCode)) {
    throw new Error("invalid format course code");
  }
};

/**
 * Verifies that the title is not null
 * @param {String} title
 */
var verifyTitle = async title => {
  if (!title){
		throw new Error("invalid format title");
	}
};

/**
 * Verifies that the department sub name is in the following format: XXXX
 * @param {String} department
 */
var verifyDepartmentSubName = async department => {
	if (!department || (String(department).length !== MAX_DEPARTMENTSUBNAME_LENGTH) || !isAlphabet(department)){
		throw new Error("invalid format department name");
	}
};

/**
 * Verifies that the phased_out is either 0 or 1
 * @param {String} phaseOut
 */
var verifyPhaseOut = async phaseOut => {
	if (!phaseOut || !(String(phaseOut).match(/^[01]$/i)) ){
		throw new Error("invalid format phased out");
	}
};

module.exports = {
  verifyUsername,
  verifyPassword,
  verifyEmail,
  verifyStudentId,
  verifyAdminId,
  verifyCourse,
  verifyCurriculumName,
  verifyCurrType,
  verifyDepartmentName,
  verifyNumOfElectives,
  verifyCourseOffering,
  verifyCoreq,
  verifyPrereq,
  verifyCourseCode,
  verifyTitle,
  verifyDepartmentSubName,
  verifyPhaseOut
};
