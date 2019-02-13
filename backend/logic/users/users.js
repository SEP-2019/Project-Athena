var mysql = require('../../sql/connection');
var format = require('../../validation/format');
var crypto = require('crypto');

exports.insertStudentUser = (username, password, email, id) => {
	return new Promise(function(res, rej) {
		// Connect to database
		var promise = new Promise(function(resolve, reject) {
			mysql.getConnection(function(err, conn) {
				if (err) { reject(err); }
				resolve(conn);
			});
		});

		// Await for connection
		promise.then(function(value) {
			var connection = value;
			var error;

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
				error = 'invalid format username'
			} else if (!format.verifyPassword(password)) {
				error = 'invalid format password'
			} else if (!format.verifyEmail(email)) {
				error = 'invalid format email'
			}

			if (error) {
				connection.release();
				console.error(error);
				res(error);
				return;
			}

			// Hash the password
			var hash = crypto.createHash('sha512').update(password).digest('base64');

			// Begin transaction with database
			connection.beginTransaction(function(error) {
				if (error) { res(logError(connection, error)); return; }
				// Test and insert into users table
				connection.query('INSERT INTO users VALUES(?, ?, ?);',
				                 [username, email, hash],
				                 function (error, results, fields) {
					if (error) { res(logError(connection, error)); return; }
					// Test and insert into students table
					connection.query('INSERT INTO students VALUES(?, ?);',
					                 [id, username],
					                 function (error, results, fields) {
						if (error) { res(logError(connection, error)); return; }
						// Commit transaction
						connection.commit(function(error) {
							if (error) { res(logError(connection, error)); return; }
							connection.release();
							res('true');
						});
					});
				});
			});
		}, function(reason) {
			console.error('Failed to establish connection to database');
			console.error(reason);
			res('false');
		});
	});
}

function logError(connection, error) {
	console.error(error);
	connection.rollback();
	connection.release();
	return 'false';
}
