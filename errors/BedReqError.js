class BadReqError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bed Request Error';
    this.statusCode = 400;
  }
}

module.exports = BadReqError;
