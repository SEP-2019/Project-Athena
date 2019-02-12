var express = require('express');
var mysql = require('../sql/connection');
var format = require('../validation/format');
var router = express.Router();

/* GET users listing. */
router.post('/addUser', function(req, res, next) {
	var username = req.query.username;
	var password = req.query.password;
	var email = req.query.email;
	var id = req.query.student_id;

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
			res.send(error);
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
			res.send(error);
			return;
		}

		// Begin transaction with database
		connection.beginTransaction(function(error) {
			if (error) { res.send(logError(connection, error)); return;	}
			// Test and insert into users table
			connection.query('INSERT INTO users VALUES(?, ?, ?);',
		                   [username, email, password],
		                   function (error, results, fields) {
				if (error) { res.send(logError(connection, error)); return; }
				// Test and insert into students table
				connection.query('INSERT INTO students VALUES(?, ?);',
				                 [id, username],
				                 function (error, results, fields) {
					if (error) { res.send(logError(connection, error)); return; }
					// Commit transaction
					connection.commit(function(error) {
						if (error) { res.send(logError(connection, error)); return; }
						res.send('true');
						connection.release();
						return;
					});
				});
			});
		});
	});
});

function logError(connection, error) {
	console.error(error);
	connection.rollback();
	connection.release();
	return 'false';
}

module.exports = router;
