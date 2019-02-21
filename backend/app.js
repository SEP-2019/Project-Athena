let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport')
let bodyParser = require('body-parser');
require('dotenv').config();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let coursesRouter = require('./routes/courses');
let tagsRouter = require('./routes/tags');

let app = express();

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./routes/users.js')(passport);
require('./logic/users.js')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use('/tags', tagsRouter);

module.exports = app;
