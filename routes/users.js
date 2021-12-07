const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;