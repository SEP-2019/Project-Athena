var mocha = require('mocha');
var users = require('../logic/users/users.js');
var assert = require('assert');
var nock = require('nock');

/*
const host = 'http://localhost:3000';
const addStudentURL = '/users/addStudentUser';

describe('POST /users/addStudentUser', function() {
	it('responds with undefined username', function() {
		nock(host)
			.post(addStudentURL, {'password': 'password',
			                      'email': 'email@email.com',
			                      'student_id': '123456789'})
			.reply(200, 'undefined username');	
	});

	it('responds with undefined password', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			               'email': 'email@email.com',
			               'student_id': '123456789'})
			.reply(200, 'undefined password');
	});

	it('responds with undefined email', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			                      'password': 'password',
			                      'student_id': '123456789'})
			.reply(200, 'undefined email');
	});

	it('responds with undefined id', function() {
		nock(host)
			.post(addStudentURL, {'username': 'username',
			                      'password': 'password',
			                      'student_id': '123456789'})
			.reply(200, 'undefined id');
	});
});
*/

describe('Tests add student user', function() {
	it('responds with undefined username', function (done) {
		users.insertStudentUser(null, 'password', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'undefined username');
					resolve();
				}).then(done);
		     	});
	});

	it('responds with undefined password', function (done) {
		users.insertStudentUser('username', null, 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'undefined password');
					resolve();
				}).then(done);
		     	});
	});

	it('responds with undefined email', function (done) {
		users.insertStudentUser('username', 'password', null, '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'undefined email');
					resolve();
				}).then(done);
		     	});
	});

	it('responds with undefined id', function (done) {
		users.insertStudentUser('username', 'password', 'email@email.com', null)
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'undefined id');
					resolve();
				}).then(done);
		     	});
	});

	var expectedInvalidUsername = 'invalid format username';
	it('responds with invalid format username 1', function (done) {
		users.insertStudentUser('usernameWithSymbols123%@^', 'password', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, expectedInvalidUsername);
					resolve();
				}).then(done);
		     	});
	});

	it('responds with invalid format username 2', function(done) {
		users.insertStudentUser('username123%@^', 'password', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, expectedInvalidUsername);
					resolve();
				}).then(done);
		     	});
	});

	it('responds with invalid format username 3', function (done) {
		users.insertStudentUser('RidiculouslyLongUsernameThatHasZeroPurposeToBeMadeAndAddedIntoTheDatabase',
		                        'password', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, expectedInvalidUsername);
					resolve();
				}).then(done);
		     	});
	});
	
	var expectedInvalidPass = 'invalid format password';
	it('responds with invalid format password 1', function(done) {
		users.insertStudentUser('username', 'short', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, expectedInvalidPass);
					resolve();
				}).then(done);
		     	});
	});

	it('responds with invalid format password 2', function (done) {
		users.insertStudentUser('username',
		                        'thisIsARidiculouslyLongPasswordAndStuffButKeepGoingBecauseYeahSoDontDoThis',
		                        'email',
		                        '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, expectedInvalidPass);
					resolve();
				}).then(done);
		     	});
	});

	it('responds with true 1', function(done) {
		users.insertStudentUser('username1', 'password', 'email@email.com', '123456789')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'true');
					resolve();
				}).then(done);
		     	});
	});

	it('responds with true 2', function (done) {
		users.insertStudentUser('username', 'passWITHsymbo!@#AOZ;]', 'email@email.com', '2af24gae1')
			.then(response => {
				return new Promise(function (resolve) {
					assert.equal(response, 'true');
					resolve();
				}).then(done);
		     	});
	});
});
