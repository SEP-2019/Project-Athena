const mysql = require("../../sql/connection");

var getAllTags = async () => {
  let connection = await mysql.getNewConnection();

  try {
    let tags = await connection.query("SELECT * FROM tags;");
    connection.release();
    return tags;
  } catch (error) {
    console.error(error);
    connection.release();
    throw new Error(false);
  }
};

module.exports = {
  getAllTags
};
