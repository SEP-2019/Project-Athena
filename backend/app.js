let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
//let passport = require("passport");
let bodyParser = require("body-parser");
require("dotenv").config();

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let coursesRouter = require("./routes/courses");
let tagsRouter = require("./routes/tags");
let curriculumRouter = require("./routes/curriculums");

let app = express();

// For Passport
/* app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions */

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/tags", tagsRouter);
app.use("/curriculums", curriculumRouter);

module.exports = app;
