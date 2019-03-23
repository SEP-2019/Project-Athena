let FormatError = require("./CustomErrors").FormatError;
const MAX_USERNAME_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 64;
const MAX_CURR_NAME_LENGTH = 128;
const MAX_DEPARTMENT_LENGTH = 256;
const MAX_DEPARTMENTSUBNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 8;
const MAX_EMAIL_LENGTH = 384;
const ID_LENGTH = 9;
const MAX_ID = 2147483647;
const MAX_DESCRIPTION_LENGTH = 1000;
const YEAR_LENGTH = 4;

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
  return String(str).match(/^([a-zA-Z0-9:| \-])+$/i);
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
    return false;
  }
  return String(str).match(/^[a-z]+$/i);
}

/**
 * Verifies that the username only contains alphanumerical characters
 * @param {string} username
 * @throws {FormatError}
 */
var verifyUsername = username => {
  if (!username) {
    throw new FormatError("Username cannot be empty");
  }

  if (String(username).length > MAX_USERNAME_LENGTH) {
    throw new FormatError(`Username length must be less than ${MAX_USERNAME_LENGTH}`);
  }

  if (!isAlphanumeric(username)) {
    throw new FormatError("Username must be alphanumeric");
  }
  return true;
};

/**
 * Verifies that the password is at least 8 characters and 64 characters in length
 * @param {string} password
 * @throws {FormatError}
 */
var verifyPassword = password => {
  if (!password) {
    throw new FormatError("Password cannot be empty");
  }
  if (String(password).length > MAX_PASSWORD_LENGTH || String(password).length < MIN_PASSWORD_LENGTH) {
    throw new FormatError(`Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`);
  }
  return true;
};

/**
 * Verifies if an email is valid or not.
 * @param {string} email
 * @throws {FormatError}
 */
var verifyEmail = email => {
  if (!email) {
    throw new FormatError("Email cannot be empty");
  }
  if (String(email).length > MAX_EMAIL_LENGTH) {
    throw new FormatError(`Email length must be less than ${MAX_EMAIL_LENGTH}`);
  }

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    throw new FormatError("Invalid email format");
  }
  return true;
};

/**
 * Verify if id exists, is numeric and less than bounds for an int
 * @param {int} id
 * @throws {FormatError}
 */
var verifyId = id => {
  if (!id) {
    throw new FormatError("Id cannot be empty");
  }
  if (!isNumeric(id)) {
    throw new FormatError("Id must be numeric");
  }
  if (id > MAX_ID) {
    throw new FormatError("Id too large");
  }
};

/**
 * Verifies that the student id is 9 digits long
 * @param {int} id
 * @throws {FormatError}
 */
var verifyStudentId = id => {
  verifyId(id);
  if (String(id).length != ID_LENGTH) {
    throw new FormatError(`Id length must be ${ID_LENGTH}`);
  }
  return true;
};

/**
 * Verifies that the curriculum name only contains alphanumerical characters
 * @param {string} curriculum
 * @throws {FormatError}
 */
var verifyCurriculumName = curriculum => {
  if (!curriculum) {
    throw new FormatError("Curriculum name cannot be empty");
  }
  if (String(curriculum).length > MAX_CURR_NAME_LENGTH) {
    throw new FormatError(`Curriculum name length must be less than ${MAX_CURR_NAME_LENGTH}`);
  }
  if (!isAlteredAlphanumeric(curriculum)) {
    throw new FormatError("Curriculum name must be alphanumeric");
  }
  return true;
};

/**
 * Verifies that the curriculum type is major or minor
 * @param {string} type
 * @throws {FormatError}
 */
var verifyCurrType = type => {
  if (!type) {
    throw new FormatError("Curriculum type cannot be empty");
  }
  if (!(type.toUpperCase() === "MAJOR") && !(type.toUpperCase() === "MINOR")) {
    throw new FormatError('Curriculum type must be "MAJOR" or "MINOR"');
  }
  return true;
};
/**
 * Verifies that the department name only contains alphanumerical characters
 * @param {string} department
 * @throws {FormatError}
 */
var verifyDepartmentName = department => {
  if (!department) {
    throw new FormatError("Department name cannot be empty");
  }
  if (String(department).length > MAX_DEPARTMENT_LENGTH) {
    throw new FormatError(`Department name length must be less than ${MAX_DEPARTMENT_LENGTH}`);
  }
  if (!isAlteredAlphanumeric(department)) {
    throw new FormatError("Department name must be alphanumeric");
  }
  return true;
};

/**
 * Verifies that the num of electives is numeric
 * @param {int} numOfElectives
 * @throws {FormatError}
 */
var verifyNumOfElectives = numOfElectives => {
  if (!numOfElectives) {
    throw new FormatError("Number of electives cannot be empty");
  }
  if (!isNumeric(numOfElectives)) {
    throw new FormatError("Number of electives must be numeric");
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
 * @throws {FormatError}
 */
var verifyCourses = async courses => {
  if (!courses) {
    throw new FormatError("Courses cannot be empty");
  }
  for (let course in courses) {
    if (!isMcGillCourse(course)) {
      throw new FormatError(`Invalid course format for course ${course}`);
    }
    courses[course].forEach(row => {
      if (!isMcGillSemester(row.semester) || !isNumeric(row.section)) {
        throw new FormatError(`Invalid semester format for semester ${row.semester} for course ${course}`);
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
 * @throws {FormatError}
 */
var verifyCourseOffering = async courseOfferings => {
  for (let course in courseOfferings) {
    if (!isMcGillCourse(course)) {
      throw new FormatError(`Invalid course format for course ${course}`);
    }

    courseOfferings[course].forEach(row => {
      if (!isNumeric(row.id) || !isMcGillSemester(row.semester) || !isNumeric(row.section)) {
        throw new FormatError(`Invalid offering format for semester ${row.semester} for course ${course}`);
      }
    });
  }
};

/**
 * Verifies that the year is in the following format: 1234
 * @param {String} semester
 */
var verifyYear = year => {
  if (!year) {
    throw new FormatError("Curriculum year cannot be empty");
  }
  if (!/^\d{4}$/.test(year)) {
    throw new FormatError("Curriculum year must be an integer of length 4");
  }
  return true;
};

function isMcGillSemester(semester) {
  if (!/^[WSF]{1}\d{4}$/i.test(semester)) {
    return false;
  }
  return true;
}
/**
 * Verifies that a list of course corequisistes is valid
 * @param {JSON} coreqs
 *        {
 *          "ECSE 428": ["ECSE 321"],
 *          "MATH 270": ["MATH 140", "MATH 240"]
 *        }
 * @throws {FormatError}
 */
var verifyCoreq = async coreqs => {
  for (let course in coreqs) {
    if (!isMcGillCourse(course)) {
      throw new FormatError(`Invalid course format for course ${course}`);
    }

    coreqs[course].forEach(coreqCourse => {
      if (!isMcGillCourse(coreqCourse)) {
        throw new FormatError(`Invalid coreq course format for coreq course ${coreqCourse}`);
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
 * @throws {FormatError}
 */
var verifyPrereq = async prereqs => {
  for (let course in prereqs) {
    if (!isMcGillCourse(course)) {
      throw new FormatError(`Invalid course format for course ${course}`);
    }

    prereqs[course].forEach(prereqCourse => {
      if (!isMcGillCourse(prereqCourse)) {
        throw new FormatError(`Invalid prereq course format for prereq course ${prereqCourse}`);
      }
    });
  }
};

/**
 * Verifies if the course code is valid
 * @param {string} courseCode
 * @throws {FormatError}
 */
var verifyCourseCode = courseCode => {
  if (!isMcGillCourse(courseCode)) {
    throw new FormatError(`Invalid format course code for course ${courseCode}`);
  }
};

/**
 * Verifies that the title is not null
 * @param {String} title
 * @throws {FormatError}
 */
var verifyTitle = title => {
  if (!title) {
    throw new FormatError(`Invalid format title for title ${title}`);
  }
};

/**
 * Verifies that the department sub name is in the following format: XXXX
 * @param {String} department
 * @throws {FormatError}
 */
var verifyDepartmentSubName = department => {
  if (!department) {
    throw new FormatError("Department name cannot be empty");
  }
  if (!isAlphabet(department)) {
    throw new FormatError("Department name must be alphabetical");
  }
  if (String(department).length !== MAX_DEPARTMENTSUBNAME_LENGTH) {
    throw new FormatError(`Department name length must be ${MAX_DEPARTMENTSUBNAME_LENGTH}`);
  }
};

/**
 * Verifies that the phased_out is either 0 or 1
 * @param {String} phaseOut
 * @throws {FormatError}
 */
var verifyPhaseOut = phaseOut => {
  if (!phaseOut || !String(phaseOut).match(/^[01]$/i)) {
    throw new FormatError("Invalid format phased out");
  }
};

/**
 * Verifies that the credits is an integer from 0 to 9
 * @param {int} credits
 */
var verifyCredits = credits => {
  if (!credits || !String(credits).match(/^[0123456789]$/i)) {
    throw new Error("invalid format credits");
  }
};

var verifyDescription = description => {
  if (!description || String(description).length > MAX_DESCRIPTION_LENGTH) {
    throw new Error("invalid format description");
  }
};

/**
 * Verifies that the tag is not null
 * @param {String} tag
 */
var verifyTag = tag => {
  if (!tag) {
    throw new Error("invalid format tag");
  }
};

/**
 * Verifies all the course codes in the list are valid
 * @param {[string]} courseCodeList:
 * ["ECSE 200", "COMP 202", "MATH 262", "MATH 263"]
 * @throws {FormatError}
 */
var verifyCourseCodeList = courseCodeList => {
  for (let course in courseCodeList) {
    verifyCourseCode(courseCodeList[course]);
  }
};

module.exports = {
  verifyUsername: verifyUsername,
  verifyPassword: verifyPassword,
  verifyEmail: verifyEmail,
  verifyStudentId: verifyStudentId,
  verifyId: verifyId,
  verifyCourses: verifyCourses,
  verifyCurriculumName: verifyCurriculumName,
  verifyCurrType: verifyCurrType,
  verifyDepartmentName: verifyDepartmentName,
  verifyNumOfElectives: verifyNumOfElectives,
  verifyCourseOffering: verifyCourseOffering,
  verifyCoreq: verifyCoreq,
  verifyPrereq: verifyPrereq,
  verifyCourseCode: verifyCourseCode,
  verifyTitle: verifyTitle,
  verifyDepartmentSubName: verifyDepartmentSubName,
  verifyPhaseOut: verifyPhaseOut,
  verifyCourseCodeList: verifyCourseCodeList,
  verifyCredits: verifyCredits,
  verifyDescription: verifyDescription,
  verifyTag: verifyTag,
  verifyYear: verifyYear
};
