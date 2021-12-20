const bcrypt = require('bcryptjs');
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
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Некоректный _id пользователя' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Введены некорректиные данные' });
        return;
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        res.send({ message: 'Пользователь с таким email уже зарегестрирован' });
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

      if (err.name === 'CastError') {
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

      if (err.name === 'CastError') {
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
