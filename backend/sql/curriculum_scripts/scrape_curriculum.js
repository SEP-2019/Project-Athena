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
}
test();
