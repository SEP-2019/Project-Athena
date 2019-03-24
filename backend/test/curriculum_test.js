const curriculums = require("../logic/curriculums/curriculums.js");
const courses = require("../logic/courses/courses.js");
const assert = require("assert");
const mysql = require("../sql/connection");

describe("Test retrieve curriculum by name", function() {
    before(async () => {
        const conn = await mysql.getNewConnection();
      //clean up the database beforehand, just in case.
        await conn.query(
          `DELETE FROM curriculum_core_classes WHERE course_code = ?;`,
          ["TEST 001"]
        );
        await conn.query(
          `DELETE FROM curriculum_tech_comps WHERE course_code = ?;`,
          ["TEST 002"]
        );
        await conn.query(
          `DELETE FROM curriculum_complementaries WHERE course_code = ?;`,
          ["TEST 003"]
        );
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 001"
        ]);
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 002"
        ]);
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 003"
        ]);
        await conn.query(`DELETE FROM curriculums WHERE curriculum_name = ?;`, [
          "Curriculumn Test 1"
        ]);
    
        await conn.query(
          "INSERT INTO curriculums (curriculum_name, type, department, numOfElectives) VALUES(?, ?, ?, ?);",
          ["Curriculumn Test 1", "Major", "Electrical Engineering", "3"]
        );
    
        await courses.addCourse(
          "TEST 001",
          "Assign Course to Curriculumn Test 001",
          "TEST",
          "0",
          "Description for TEST 001",
          3
        );
    
        await courses.addCourse(
          "TEST 002",
          "Assign Course to Curriculumn Test 001",
          "TEST",
          "0",
          "Description for TEST 002",
          3
        );

        await courses.addCourse(
          "TEST 003",
          "Assign Course to Curriculumn Test 001",
          "TEST",
          "0",
          "Description for TEST 003",
          3
        );
    
        await courses.assignCourseToCurriculum(
          "core",
          "TEST 001",
          "Curriculumn Test 1"
        );

        await courses.assignCourseToCurriculum(
          "techComp",
          "TEST 002",
          "Curriculumn Test 1"
        );

        await courses.assignCourseToCurriculum(
          "complementaries",
          "TEST 003",
          "Curriculumn Test 1"
        );
    
        conn.release();
      });

    it(`responds with "Name cannot be empty"`, async function() {
      return curriculums.getCurriculum("").then(function(res) {
        //Do nothing, looking for rej
        },function(rej) {
            let result = false;
            if(rej === "Name cannot be empty"){
                result = true;
            }
            assert(true,result);
        }
      );
    });

    it("responds with valid curriculum with all available info", async function() {
        return curriculums.getCurriculum("Curriculumn Test 1").then(function(res) {
          let found = 0;
          let passed = false;

          let core_class = { course_Code: "TEST 001" };
          let tech_class = { course_Code: "TEST 002" };
          let comp_class = { course_Code: "TEST 003" };
          if(JSON.stringify(core_class) == JSON.stringify(res.core_classes[0])){
            found +=1;
          }
          if(JSON.stringify(tech_class) == JSON.stringify(res.tech_comps[0])){
            found +=1;
          }
          if(JSON.stringify(comp_class) == JSON.stringify(res.complementaries[0])){
            found +=1;
          }
          if(found===3){
            passed = true;
          }
        assert(true, found);
        });
      });

      after(async () => {
        const conn = await mysql.getNewConnection();
    
        await conn.query(
          `DELETE FROM curriculum_core_classes WHERE course_code = ?;`,
          ["TEST 001"]
        );
        await conn.query(
          `DELETE FROM curriculum_tech_comps WHERE course_code = ?;`,
          ["TEST 002"]
        );
        await conn.query(
          `DELETE FROM curriculum_complementaries WHERE course_code = ?;`,
          ["TEST 003"]
        );
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 001"
        ]);
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 002"
        ]);
        await conn.query(`DELETE FROM courses WHERE course_code = ?;`, [
          "TEST 003"
        ]);
        await conn.query(`DELETE FROM curriculums WHERE curriculum_name = ?;`, [
          "Curriculumn Test 1"
        ]);
    
        await conn.release();
      });
  });