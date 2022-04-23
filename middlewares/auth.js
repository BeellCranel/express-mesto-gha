const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const JWT_SECRET = 'werysecretpassword';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) next(new ForbiddenError('Необходима авторизация'));
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
