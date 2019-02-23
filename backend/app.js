let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
require('dotenv').config();
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let coursesRouter = require('./routes/courses');
var customResponse = require('./validation/customResponse')

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/courses', coursesRouter);
app.use(function (err, req, res, next) {
    console.error(err.stack)
    if (!isNaN(err.code)) {
        res.status(err.code)
    } else {
        res.status(500)
    }
    res.send(customResponse('An error occured', err))
})

module.exports = app;