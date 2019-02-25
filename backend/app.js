let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let bodyParser = require("body-parser");
let cors = require("cors");
require("dotenv").config();

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let coursesRouter = require("./routes/courses");
let tagsRouter = require("./routes/tags");

let app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/tags", tagsRouter);

module.exports = app;
