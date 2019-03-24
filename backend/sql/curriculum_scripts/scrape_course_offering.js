const mysql = require("../connection");
const rp = require("request-promise");
const cheerio = require("cheerio");

let connection;

async function parse_courses_offerings(url) {
  return new Promise((resolve, reject) => {
    //rp is the request promise package, it fetches a url and returns a promise that contains site data
    rp(url)
      .then(function(html) {
        let $ = cheerio.load(html);
        let terms = $(".catalog-terms").text();
        terms = terms.substring(19, terms.length - 4).split(",");
        for (let i = 0; i < terms.length; i++) {
          terms[i] = terms[i].trim();
          terms[i] = terms[i].substring(0, 1);
        }
        resolve(terms);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

async function parse_all_course_offerings() {
  connection = await mysql.getNewConnection();
  let courses = await connection.query("SELECT course_code FROM courses;");
  await connection.query("SET sql_safe_updates=0;");
  await connection.query("DELETE FROM course_offerings WHERE 1 = 1;");
  await connection.query("SET sql_safe_updates=1;");
  for (let i = 0; i < courses.length; i++) {
    for (let year = 2012; year < 2019; year++) {
      let url =
        "https://www.mcgill.ca/study/" +
        year +
        "-" +
        (year + 1) +
        "/courses/" +
        courses[i].course_code.substring(0, 4) +
        "-" +
        courses[i].course_code.substring(5, 8);
      console.log(url);
      try {
        let response = await parse_courses_offerings(url);
        for (let j = 0; j < response.length; j++) {
          let semester;
          if (response[j] == "F") {
            semester = response[j] + year;
          } else if (response[j] == "W") {
            semester = response[j] + (year + 1);
          } else if (response[j] == "S") {
            semester = response[j] + (year + 1);
          }
          await connection.query(
            "INSERT INTO course_offerings (semester, scheduled_time, course_code, section) VALUES (?, ?, ?, ?);",
            [semester, "Not available", courses[i].course_code, 1]
          );
        }
      } catch (err) {}
    }
  }
  connection.release();
}

parse_all_course_offerings();
