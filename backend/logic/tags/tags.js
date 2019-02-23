const mysql = require("../../sql/connection");

var getAllTags = async () => {
  let connection = await mysql.getNewConnection();
  let tags;
  let result = [];

  try {
    result = await connection.query("SELECT name FROM tags;");
  } catch (error) {
    console.error(error);
  }
  connection.release();

  if (result) {
    tags = result;
  }
  return tags;
};

module.exports = {
  getAllTags
};
