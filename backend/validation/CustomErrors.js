class FormatError extends Error {
  constructor(error) {
    super(error);
    this.name = "FormatError";
    this.code = 400;
  }
}

class CustomError extends Error {
  constructor(error, code){
    super(error);
    this.code = code
  }
}

module.exports = {
  FormatError,
  CustomError
};
