const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthentificationError = require('../errors/AuthentificationError')
const NotFoundError = require('../errors/NotFoundError')
const IncorrectDataError = require('../errors/IncorrectDataError')
const EmailError = require('../errors/EmailError')

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new AuthentificationError('Неправильные почта или пароль'));
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId ? req.params.userId : req.user._id)
    .orFail(() => {
      throw new NotFoundError ('Нет пользователя с таким _id' );
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
        if (err.name === 'CastError') {
          throw new IncorrectDataError ('Некоректный _id пользователя');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
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
        throw new IncorrectDataError('Введены некорректиные данные');
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        throw new EmailError ('Пользователь с таким email уже зарегестрирован');
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
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
      throw new NotFoundError ('Нет пользователя с таким _id' );
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError ('Введены некорректиные данные');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError ('Некоректный _id пользователя');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
      throw new NotFoundError ('Нет пользователя с таким _id' );
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError ('Введены некорректиные данные');
      }

      if (err.name === 'CastError') {
        throw new IncorrectDataError ('Некоректный _id пользователя');
      }
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
};
