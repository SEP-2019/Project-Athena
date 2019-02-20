const mysql = require('mysql');
const util = require('util');

const db_config = {
	//DEV database
	connectionLimit: 100,
	host: 'us-cdbr-iron-east-03.cleardb.net',
	user: 'bd17b1984d3b71',
	password: '5945ae958d07ae4',
	connectionTimeout: 10000,
	database: 'heroku_f11d5f6ef0dc063'
	//PROD database 
	/*
	connectionLimit: 100,
	host: 'us-cdbr-iron-east-03.cleardb.net',
	user: 'bc3b1bec1b7226',
	password: 'b6054e24',
	connectionTimeout: 10000,
	database: 'heroku_35d3c28bdd7d221'
	*/
}

let pool = mysql.createPool(db_config);

async function getNewConnection() {
	try {
		pool.getConnection = util.promisify(pool.getConnection);
		conn = await pool.getConnection();
		conn.query = util.promisify(conn.query);
		conn.beginTransaction = util.promisify(conn.beginTransaction);
		return(conn);
	} catch (error) {
		console.log(error);
	}
}

module.exports.pool = pool;
module.exports.getNewConnection = getNewConnection;