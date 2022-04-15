const User = require('../models/user');
const BadReqError = require('../errors/BedReqError');
const NotFoundError = require('../errors/NotFounError');

const findUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) throw new NotFoundError('В базе нет пользователей');
      res.status(200).send({ data: user });
    })
    .catch((err) => next(err));
};

const findUserById = (req, res, next) => {
  const userId = req.params.userId ? req.params.userId : req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadReqError('Переданы некорректные данные. Пользователь с этим Id отсутствует'));
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError('Переданы некорректные данные при создании пользователя'));
      next(err);
    });
};

module.exports = {
  findUsers,
  findUserById,
  createUser,
};
