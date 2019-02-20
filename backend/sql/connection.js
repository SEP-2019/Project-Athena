const mysql = require('mysql');
const util = require('util');

const db_config = {
//TODO env variables
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
		console.error(error);
		throw new Error('Unable to connect to the database');
	}
}

module.exports = {pool, getNewConnection};