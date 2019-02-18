const mysql = require('../../sql/connection');

async function queryCourseByTag(tag){
    //if an invalid tag is passed, an empty object is returned
    let connection = await mysql.getNewConnection();
    let courses = await connection.query('SELECT course_code FROM course_tag WHERE course_tag.tag_name LIKE ?', tag);
    return (JSON.parse(JSON.stringify(courses)));
}
//queryCourseByTag('Engineering').then(response => console.log(JSON.parse(JSON.stringify(response))));
module.exports.queryCourseByTag = queryCourseByTag;