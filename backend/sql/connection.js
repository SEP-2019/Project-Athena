var mysql = require('mysql');

var db_config = {
	connectionLimit: 100,
	host: 'us-cdbr-iron-east-03.cleardb.net',
	user: 'bd17b1984d3b71',
	password: 'cc800052',
	connectionTimeout: 10000,
	database: 'heroku_f11d5f6ef0dc063'
}

var pool = mysql.createPool(db_config);

module.exports = pool;
