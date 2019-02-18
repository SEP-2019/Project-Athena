const mysql = require('../../sql/connection');

exports.queryCoursesByTag = (tag) => {
    return new Promise(function(resolve,reject){
        let promise = new Promise(function(resolve,reject){
            mysql.getConnection()
        })
    });
}