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
  User.findById(req.params.userId)
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

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError('Переданы некорректные данные при обновлении аватара'));
      next(err);
    });
};

module.exports = {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  updateAvatar,
};
