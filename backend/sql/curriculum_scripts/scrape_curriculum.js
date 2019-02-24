const mysql = require("../connection");
const rp = require("request-promise");
const cheerio = require("cheerio");

const curriculum_URL =
  "https://mcgill.ca/ece/undergrad/information/ee/2018-2019-electrical-engineering-7-semester-curriculum";

const tech_comps_URL =
  "https://www.mcgill.ca/ece/undergrad/information/ee/2018-2019-electrical-eng-technical-complementaries";

let curriculum = {
  year_start: 2018,
  year_end: 2019,
  department: "ee",
  type: "8-semester-curriculum",
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

async function store_curriculum(curriculum) {
  /*
This curriculum name will be composed
of department-year_start-year_end-type
*/

  /**
   *  You should affect courses, curriculums,
   * curriculums_complementaries (associate a curriculum with its allowed complementary courses),
   * curriculums_core_class (associate a curriculum with its required core courses),
   * curriculums_tech_comp (associate a curriculum with its allowed tech comp courses),
   * course_prereq (associate a course to its prereq),
   * course_coreq (associate a course to its coreq)
   */

  try {
    let connection = await mysql.getNewConnection();
    let courses = curriculum.courses;
    let tech_comps = curriculum.tech_comps;
    let program = program_map[curriculum.department];
    let curriculum_name = curriculum.department.concat(
      program,
      "-",
      curriculum.year_start,
      "-",
      curriculum.year_end,
      "-",
      curriculum.type
    );

    //ADD IN THE IGNOREE ON DUPLICATE

    await connection.beginTransaction();

    courses.forEach(async course => {
      await connection.query(
        "INSERT INTO courses (course_code,title,department) VALUES(?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
        [course.course_code, course.course_title, course.department]
      );

      course.prereqs.forEach(async prereq => {
        if (prereq === null || prereq === undefined) {
          return;
        }

        await connection.query(
          "INSERT INTO course_prereqs (course_code,prereq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [course.course_code, prereq]
        );
      });

      course.coreqs.forEach(async coreq => {
        if (coreq === null || coreq === undefined) {
          return;
        }
        await connection.query(
          "INSERT INTO course_coreqs (course_code,coreq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [course.course_code, coreq]
        );
      });

      //needs duplicate handler
      await connection.query(
        "INSERT INTO curriculum_core_classes (curriculum_name,course_code) VALUES(?,?);",
        [curriculum_name, course.course_code]
      );
    });

    await connection.query(
      "INSERT INTO curriculums (curriculum_name,type,department) VALUES(?,?,?) ON DUPLICATE KEY UPDATE curriculum_name=curriculum_name;",
      [curriculum_name, curriculum.type, curriculum.department]
    );

    //needs duplicate handler
    tech_comps.forEach(async tech_comp => {
      await connection.query(
        "INSERT INTO courses (course_code,title,department) VALUES(?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
        [tech_comp.course_code, tech_comp.course_title, tech_comp.department]
      );

      await connection.query(
        "INSERT INTO curriculum_tech_comps (curriculum_name,course_code) VALUES(?,?);",
        [curriculum_name, tech_comp.course_code]
      );

      tech_comp.prereqs.forEach(async prereq => {
        if (prereq === null || prereq === undefined) {
          return;
        }

        await connection.query(
          "INSERT INTO course_prereqs (course_code,prereq_course_code) VALUES(?,?) ON DUPLICATE KEY UPDATE course_code=course_code;",
          [tech_comp.course_code, prereq]
        );
      });

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
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
}

async function parse_courses(url, property) {
  return new Promise((resolve, reject) => {
    rp(url)
      .then(function(html) {
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
              .replace(/\s\d*/g, "")
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

async function test() {
  curriculum = await parse_courses(curriculum_URL, "courses");
  curriculum = await parse_courses(tech_comps_URL, "tech_comps");
  store_curriculum(curriculum);
}
test();
