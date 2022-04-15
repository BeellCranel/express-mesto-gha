const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFounError');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use((err, req, res, next) => {
  const { statusCode, name } = err;
  const errMessage = err.message;
  if (statusCode) {
    res.status(statusCode).send({
      message: `${name}: ${errMessage}. Код ошибки: ${statusCode}.`,
    });
  }
  res.send({ message: `${name}: ${errMessage}.` });
  next();
});

app.listen(PORT);
