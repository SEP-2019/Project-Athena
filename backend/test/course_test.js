const courses = require('../logic/courses/courses.js');
const assert = require('assert');

describe('Test retrieve course by tag', function() {
    it('responds with valid', function(){
        return courses.queryCourseByTag('Engineering').then(function(res){
            let found = false;
            let searchingFor = {course_code: 'ECSE 428'};
            for (course in res){
                if (JSON.stringify(course) == JSON.stringify(searchingFor))
                    found = true;
            }
            if (found){
                assert(true,true);
            }else{
                assert(true, false);
            }
        });
    });
});