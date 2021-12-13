const Card = require('../models/card');
const {
  ERROR_CODE_INCORRET_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT_MISTAKE,
} = require('../utils/variables');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Введены некорректиные данные' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет карточки с таким _id' });
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Передан некорректный _id' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет карточки с таким _id' });
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Передан некорректный _id' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Нет карточки с таким _id' });
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_INCORRET_DATA).send({ message: 'Передан некорректный _id' });
        return;
      }

      res.status(ERROR_CODE_DEFAULT_MISTAKE).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
