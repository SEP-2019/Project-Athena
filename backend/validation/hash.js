const crypto = require('crypto');

exports.hashPass = password => {
	return crypto.createHash('sha512').update(password).digest('base64');
}
