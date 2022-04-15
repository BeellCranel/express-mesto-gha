const Card = require('../models/card');
const BadReqError = require('../errors/BedReqError');
const NotFoundError = require('../errors/NotFounError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка м этим Id отсутствует');
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadReqError('Переданы некоректные данные'));
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) throw new NotFoundError('В базе нет карточек');
      res.status(200).send({ data: card });
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка м этим Id отсутствует');
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadReqError('Переданы некоректные данные'));
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка м этим Id отсутствует');
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadReqError('Переданы некоректные данные'));
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
