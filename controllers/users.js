const User = require('../models/user');

const getAllUsers = (req, res, next) => {

  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {

  User.findById(req.params.id)
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => next(err));
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,

};