const mysql = require("../../sql/connection");

var getAllTags = async () => {
  let connection = await mysql.getNewConnection();
  let result = [];
  result = await connection.query("SELECT name FROM tags;");
  connection.release();
  return result;
};

module.exports = {
  getAllTags
};
