const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { ValidationLink } = require('../utils/variables');

const {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserById);

router.get('/:userId',
  celebrate({
    params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
    }).unknown(),
  }),
getUserById);

router.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }).unknown(),
  }),
updateUserInfo);

router.patch('/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(ValidationLink),
    }).unknown(),
  }),
updateAvatar);

module.exports = router;
