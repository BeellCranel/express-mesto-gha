const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const regex = require('../utils/regex');
const NotFoundError = require('../errors/NotFounError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.use(auth);
router.use('/', userRouter);
router.use('/', cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
router.use(errors()); // обработчик ошибок celebrate
router.use(errorHandler);

module.exports = router;
