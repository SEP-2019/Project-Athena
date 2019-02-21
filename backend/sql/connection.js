const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

const db_config = {
	connectionLimit: process.env.connectionLimit,
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	connectionTimeout: process.env.connectionTimeout,
	database: process.env.database
};

let pool = mysql.createPool(db_config);
async function getNewConnection() {
	try {
		pool.getConnection = util.promisify(pool.getConnection);
		conn = await pool.getConnection();
		conn.query = util.promisify(conn.query);
		conn.beginTransaction = util.promisify(conn.beginTransaction);
		return (conn);
	} catch (err) {
		console.error(err)
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			throw new Error('Database connection was closed')
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			throw new Error('Database has too many connections.')
		}
		if (err.code === 'ECONNREFUSED') {
			throw new Error('Database connection was refused.')
		}
		throw new Error('Database connection failed')
	}
}

module.exports = {
	pool,
	getNewConnection
};
