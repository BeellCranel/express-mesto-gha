const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/BedReqError');
const NotFoundError = require('../errors/NotFounError');
const ConflictError = require('../errors/ConflictError');

const JWT_SECRET = 'verysecretpassword';

const findUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const findUserBySelfId = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      return res.status(200).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные. Пользователь с этим Id отсутствует'));
        return;
      }
      next(err);
    });
};

const findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь по указанному _id не найден');
      return res.status(200).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Переданы некорректные данные. Пользователь с этим Id отсутствует'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .status(200).send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      return res.status(200).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с указанным _id не найден');
      return res.status(200).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

module.exports = {
  findUsers,
  findUserBySelfId,
  findUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
