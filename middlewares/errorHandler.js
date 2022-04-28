module.exports = (err, req, res, next) => {
  const { statusCode, name } = err;
  const errMessage = err.message;
  if (statusCode) {
    res.status(statusCode).send({
      message: `${name}: ${errMessage}. Код ошибки: ${statusCode}.`,
    });
    return;
  }
  res.status(500).send({ message: 'Произошла ошибка на сервере' });
  next();
};
