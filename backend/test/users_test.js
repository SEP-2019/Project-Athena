var mocha = require('mocha');
var chai = require('chai');
var assert = require('assert');
var express = require('express');
var nock = require('nock');
var app = express();

const host = 'http://localhost:3000';
const addURL = '/users/addUser';

describe('assert true with true', function() {
	it('passes', function(done) {
		assert(true, true);
		done();
	});
});

describe('POST /users/addUser', function() {
	it('responds with undefined username', function() {
		nock(host)
			.post(addURL, {'password': 'password',
			               'email': 'email@email.com',
			               'student_id': '123456789'})
			.reply(200, 'undefined username');	
	});

	it('responds with undefined password', function() {
		nock(host)
			.post(addURL, {'username': 'username',
			               'email': 'email@email.com',
			               'student_id': '123456789'})
			.reply(200, 'undefined password');
	});

	it('responds with undefined email', function() {
		nock(host)
			.post(addURL, {'username': 'username',
			               'password': 'password',
			               'student_id': '123456789'})
			.reply(200, 'undefined email');
	});

	it('responds with undefined id', function() {
		nock(host)
			.post(addURL, {'username': 'username',
			               'password': 'password',
			               'student_id': '123456789'})
			.reply(200, 'undefined id');
	});
});
