const mysql = require('../../sql/connection');
const format = require('../../validation/format');
const hasher = require('../../validation/hash');

exports.insertStudentUser = (username, password, email, id) => {
	return new Promise(function (res, rej) {

		// Connect to database
		let promise = new Promise(function (resolve, reject) {
			mysql.pool.getConnection(function (err, conn) {
				if (err) {
					reject(err);
				}
				resolve(conn);
			});
		});

		// Await for connection
		promise.then(function (value) {
			let connection = value;
			let error;

			// Check for missing input params
			if (!username) {
				error = 'undefined username';
			} else if (!password) {
				error = 'undefined password';
			} else if (!email) {
				error = 'undefined email';
			} else if (!id) {
				error = 'undefined id';
			}

			if (error) {
				connection.release();
				console.error(error);
				res(error);
				return;
			}

			// Check for invalid formatting
			if (!format.verifyUsername(username)) {
				error = 'invalid format username';
			} else if (!format.verifyPassword(password)) {
				error = 'invalid format password';
			} else if (!format.verifyEmail(email)) {
				error = 'invalid format email';
			} else if (!format.verifyId(id)) {
				error = 'invalid format id';
			}

			if (error) {
				connection.release();
				console.error(error);
				res(error);
				return;
			}

			// Hash the password
			let hash = hasher.hashPass(password);

			// Begin transaction with database
			connection.beginTransaction(function (error) {
				if (error) {
					res(logError(connection, error));
					return;
				}
				// Test and insert into users table
				connection.query('INSERT INTO users VALUES(?, ?, ?);',
					[username, email, hash],
					function (error, results, fields) {
						if (error) {
							res(logError(connection, error));
							return;
						}
						// Test and insert into students table
						connection.query('INSERT INTO students VALUES(?, ?);',
							[id, username],
							function (error, results, fields) {
								if (error) {
									res(logError(connection, error));
									return;
								}
								// Commit transaction
								connection.commit(function (error) {
									if (error) {
										res(logError(connection, error));
										return;
									}
									connection.release();
									res('true');
								});
							});
					});
			});
		}, function (reason) {
			console.error('Failed to establish connection to database');
			console.error(reason);
			res('false');
		});
	});
}

exports.deleteStudentUser = async function deleteStudentUser(username) {
	let connection = await mysql.getNewConnection();

	if (!format.verifyUsername(username)) {
		connection.release();
		console.error('invalid username');
		return false; //TODO switch this with actual error when we decide if using http-errors or not 
	}
	try {
		await connection.beginTransaction();
		let student_id = await connection.query('SELECT student_id FROM students WHERE username = ?;', username)
		await connection.query('DELETE FROM students WHERE student_id = ?;', student_id[0].student_id);
		await connection.query('DELETE FROM users WHERE username = ?;', [username]);
		await connection.commit();
		return true;
	} catch (error) {
		console.error(error)
		connection.rollback();
		connection.release();
		return false; //TODO switch this with actual error when we decide if using http-errors or not 
	}
}

function logError(connection, error) {
	console.error(error);
	connection.rollback();
	connection.release();
	return 'false';
}