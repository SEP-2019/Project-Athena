const mysql = require('../../sql/connection');

async function queryCourseByTag(tag) {
    if (!tag) {
        throw Error("Undefined tag")
    }

    let connection = await mysql.getNewConnection();
    try {
        let courses = await connection.query('SELECT course_code FROM course_tag WHERE course_tag.tag_name LIKE ?', tag);
        connection.release();
        return (JSON.parse(JSON.stringify(courses)));
    } catch (error) {
        connection.release();
        console.error(error);
        throw error;
    }
}
module.exports.queryCourseByTag = queryCourseByTag;