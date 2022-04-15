class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not Found Error';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
