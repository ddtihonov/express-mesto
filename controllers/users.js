const User = require('../models/user');
const {
  ERROR_CODE_INCORRET_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT_MISTAKE,
} = require('../utils/variables');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет пользователя с таким _id' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Некоректный _id пользователя' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Введены некорректиные данные' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет пользователя с таким _id' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Введены некорректиные данные' });
        return;
      }

      if (err === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Некоректный _id пользователя' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет пользователя с таким _id' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Введены некорректиные данные' });
        return;
      }

      if (err === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Некоректный _id пользователя' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
