const mysql = require('mysql');

const db_config = {
	connectionLimit: process.env.connectionLimit,
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	connectionTimeout: process.env.connectionTimeout,
	database: process.env.database
}

let pool = mysql.createPool(db_config);

module.exports = pool;
