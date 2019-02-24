const courses = require('../logic/courses/courses.js');
const assert = require('assert');
const mysql = require('../sql/connection')

describe('Test retrieve course by tag', function() {
    it('responds with valid', async function(){
        connection = await mysql.getNewConnection()
        connection.query(`INSERT INTO courses (course_code,title, department) VALUES 
        (?,?,?) ON DUPLICATE KEY UPDATE course_code=course_code;`,['ECSE 428','Software engineering in practice', 'ECSE']);
        connection.query(`INSERT INTO tags(name) VALUES
        (?) ON DUPLICATE KEY UPDATE name=name;`,['Engineering'])
        connection.query(`INSERT INTO course_tags (course_code, tag_name) VALUES
        (?,?) ON DUPLICATE KEY UPDATE tag_name=tag_name;`,['ECSE 428', 'Engineering'])
        return courses.queryCourseByTag('Engineering').then(function(res){
            let found = false;
            let searchingFor = {course_code: 'ECSE 428'};
            for (course in res){
                if (JSON.stringify(course) == JSON.stringify(searchingFor))
                    found = true;
            }
            assert(true,found)
        });
    });
});