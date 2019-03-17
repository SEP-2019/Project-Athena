class FormatError extends Error {
  constructor(error) {
    super(error);
    this.name = "FormatError";
    this.code = 400;
  }
}

module.exports = FormatError;
