const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFounError');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use((err, req, res, next) => {
  const { statusCode } = err;
  const errMessage = err.message;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `Ошибка сервера: ${errMessage}`
      : errMessage,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
