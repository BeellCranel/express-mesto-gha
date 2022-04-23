const router = require('express').Router();
const {
  findUsers,
  findUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', findUsers);
router.get('/users/:userId', findUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
