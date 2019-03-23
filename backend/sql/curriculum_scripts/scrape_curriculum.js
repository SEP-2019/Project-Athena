const mysql = require("../connection");
const rp = require("request-promise");
const cheerio = require("cheerio");

/*
User should run the script in the following manner:
Change directory into the backend folder of the project! This is due to the .env file that we created!
that should be present in the folder

Steps:
cd Project-Athena/backend
node <pathToScript>/scrape_curriculum.js <curriculum url> <tech_comps_url>
*/

//TODO Check for reverse URL
if (process.argv.length < 4 || process.argv.length > 4) {
  console.log("You entered: " + process.argv);
  console.error(
    "Please enter the following format: node <pathToScript>/scrape_curriculum.js <curriculum url> <tech_comps_url>"
  );
  process.exit(1);
}

const curriculum_URL = String(process.argv[2]);
const tech_comps_URL = String(process.argv[3]);

/*
Example input 
curriculum: 2018-2019-electrical-engineering-7-semester-curriculum
tech comps: 2018-2019-electrical-eng-technical-complementaries
*/
let curriculum_years = curriculum_URL.match(/[0-9]{4}/g);
let tech_comp_years = tech_comps_URL.match(/[0-9]{4}/g);

if (
  curriculum_years[0] != tech_comp_years[0] ||
  curriculum_years[1] != tech_comp_years[1]
) {
  console.log(process.argv);
  console.error(
    "Please enter the curriculum and tech comp curriculums with matchings years"
  );
  process.exit(1);
}

let department = String(
  curriculum_URL.match(/\information\/[a-z]{2}/g)
).replace(/\information\//g, "");
let curriculum_year_start = curriculum_years[0];
let curriculum_year_end = curriculum_years[1];
let type = String(curriculum_URL.match(/[0-9]{1}-semester-curriculum/g));

let curriculum = {
  year_start: curriculum_year_start,
  year_end: curriculum_year_end,
  department: department,
  type: type,
  courses: [],
  tech_comps: [],
  complementary_courses: [],
  num_elective: []
};

let program_map = {
  ee: "Electrical Engineering",
  ce: "Computer Engineering",
  se: "Software Engineering"
};

/**
 * Inserts the courses collected within a curriculum to the DB
 * @param {object} curriculum
 */
async function store_curriculum(curriculum) {
  let connection = await mysql.getNewConnection();
  try {
    let courses = curriculum.courses;
    let tech_comps = curriculum.tech_comps;
    let program = program_map[curriculum.department];
    let curriculum_name =
      program +
      "|" +
      curriculum.year_start +
      "|" +
      curriculum.year_end +
      "|" +
      curriculum.type;

    await connection.beginTransaction();

    // Inserts the the new curriculum
    await connection.query(
      "INSERT INTO curriculums (curriculum_name,type,department) VALUES(?,?,?) ON DUPLICATE KEY UPDATE curriculum_name=curriculum_name;",
      [curriculum_name, curriculum.type, curriculum.department]
    );

    // Queries for Courses, coreqs and prereqs and curriculum linking
    courses.forEach(async course => {
      //Stores the courses
      await connection.query(
        "INSERT INTO courses (course_code,title,department,description,credits) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
        [
          course.course_code,
          course.course_title,
          course.department,
          course.course_description,
          course.credits
        ]
      );

      let curriculum_core_classes = await connection.query(
        "SELECT * FROM curriculum_core_classes WHERE curriculum_name = ? AND course_code = ?;",
        [curriculum_name, course.course_code]
      );

      if (curriculum_core_classes.length == 0) {
        //Links the courses to the current curriculum
        await connection.query(
          "INSERT INTO curriculum_core_classes (curriculum_name,course_code) VALUES(?,?);",
          [curriculum_name, course.course_code]
        );
      }

      //Links the corresponding prereqs with the main courses
      course.prereqs.forEach(async prereq => {
        if (prereq === null || prereq === undefined) {
          return;
        }

        await connection.query(
          "INSERT INTO course_prereqs (course_code,prereq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [course.course_code, prereq]
        );
      });

      //Links the corresponding coreqs with the main courses
      course.coreqs.forEach(async coreq => {
        if (coreq === null || coreq === undefined) {
          return;
        }
        await connection.query(
          "INSERT INTO course_coreqs (course_code,coreq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [course.course_code, coreq]
        );
      });

      // Create course offerings
      for (let year = 2010; year < 2020; year++) {
        for (let i = 0; i < course.semesters.length; i++) {
          let result = await connection.query(
            "SELECT * FROM course_offerings WHERE course_code = ? AND semester = ?;",
            [course.course_code, course.semesters[i] + year]
          );
          if (result.length == 0) {
            await connection.query(
              "INSERT INTO course_offerings (semester, scheduled_time, course_code, section) VALUES (?, ?, ?, ?);",
              [
                course.semesters[i] + year,
                "Not available",
                course.course_code,
                1,
                course.course_code
              ]
            );
          }
        }
      }
    });

    //Queries for curriculum Tech Comps
    tech_comps.forEach(async tech_comp => {
      //Insert tech comps into courses
      await connection.query(
        "INSERT INTO courses (course_code,title,department) VALUES(?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
        [tech_comp.course_code, tech_comp.course_title, tech_comp.department]
      );

      let curriculum_tech_comps = await connection.query(
        "SELECT * FROM curriculum_tech_comps WHERE curriculum_name = ? AND course_code = ?;",
        [curriculum_name, tech_comp.course_code]
      );
      if (curriculum_tech_comps.length == 0) {
        //Associate the tech comps with a certain curriculum
        await connection.query(
          "INSERT INTO curriculum_tech_comps (curriculum_name,course_code) VALUES(?,?);",
          [curriculum_name, tech_comp.course_code]
        );
      }

      //Links the corresponding prereqs with the tech comps
      tech_comp.prereqs.forEach(async prereq => {
        if (prereq === null || prereq === undefined) {
          return;
        }

        await connection.query(
          "INSERT INTO course_prereqs (course_code,prereq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [tech_comp.course_code, prereq]
        );
      });

      //Links the corresponding coreqs with the tech comps
      tech_comp.coreqs.forEach(async coreq => {
        if (coreq === null || coreq === undefined) {
          return;
        }

        await connection.query(
          "INSERT INTO course_coreqs (course_code,coreq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [tech_comp.course_code, coreq]
        );
      });
    });

    await connection.commit();
    console.log("Updated curriculum and courses");
  } catch (error) {
    console.error(error);
  } finally {
    console.log("release");
    connection.release();
  }
}

function parse_semester(semester) {
  let semesters = [];
  semester.each((index, element) => {
    switch (element.attribs.class) {
      case "fall":
        semesters.push("F");
        break;
      case "summer":
        semesters.push("S");
        break;
      case "winter":
        semesters.push("W");
        break;
      default:
        break;
    }
  });
  return semesters;
}

/**
 * Web Scrapes the specified McGill URL for course data
 * @param {URL} url
 * @param {String} property
 *
 * courses will take the following format:
 * {
 *  course_code: ecse 427,
 *  course_title: Operating Systems,
 *  department:ECSE
 *  course_description:Study of operating systems...etc,
 *  credits: 3
 * }
 */
async function parse_courses(url, property) {
  return new Promise((resolve, reject) => {
    //rp is the request promise package, it fetches a url and returns a promise that contains site data
    rp(url)
      .then(function(html) {
        //Cheerio is a lightweight scrapping tool that will go through the site data returned by np
        let $ = cheerio.load(html);

        $(".object_mediumcourse").each((i, course_element) => {
          let course = {
            course_code: $(course_element)
              .find(".course_number")
              .text(),
            course_title: $(course_element)
              .find(".course_title")
              .text(),
            course_description: $(course_element)
              .find(".course_description")
              .text(),
            department: $(course_element)
              .find(".course_number")
              .text()
              .replace(/\s\d*/g, ""),
            credits: $(course_element).find(".course_credits")
              ? parseInt(
                  $(course_element)
                    .find(".course_credits")
                    .text()
                    .match(/[0-9]{1}/g)
                )
              : 0,
            semesters: parse_semester(
              $(course_element).find("li.course_terms > ul > li")
            )
          };

          let coreqs = [];
          let prereqs = [];

          $(course_element)
            .find("li:contains('Corequisite') a")
            .each((i, coreq) => {
              let coreq_name = $(coreq).text();
              if (coreq_name) {
                coreqs.push(coreq_name);
              }
            });

          $(course_element)
            .find("li:contains('Prerequisite') a")
            .each((i, prereq) => {
              let prereq_name = $(prereq).text();
              if (prereq_name) {
                prereqs.push(prereq_name);
              }
            });

          course["prereqs"] = prereqs;
          course["coreqs"] = coreqs;

          curriculum[property].push(course);
        });
        resolve(curriculum);
      })
      .catch(function(err) {
        console.error("Error retrieving curriculum", err);
        reject(err);
      });
  });
}

async function scrape_curriculum() {
  curriculum = await parse_courses(curriculum_URL, "courses");
  curriculum = await parse_courses(tech_comps_URL, "tech_comps");
  store_curriculum(curriculum);
}

scrape_curriculum();
