const Card = require('../models/card');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ card }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new IncorrectDataError('Введены некорректиные данные');
        }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError ('Нет карточки с таким _id');
    })
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        next(new AuthorizationError('Нельзя удалить чужую карточку'));
      }else {
        card.remove()
          .then(() => res.status(200).send(card))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.message === 'Нет карточки с таким _id') {
        throw new NotFoundError('Нет карточки с таким _id');
      } else if (err.name === 'CastError') {
        throw new IncorrectDataError('Передан некорректный _id');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError ('Нет карточки с таким _id');
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.message === 'Нет карточки с таким _id') {
        throw new NotFoundError('Нет карточки с таким _id');
      } else if (err.name === 'CastError') {
        throw new IncorrectDataError('Передан некорректный _id');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError ('Нет карточки с таким _id');
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.message === 'Нет карточки с таким _id') {
        throw new NotFoundError('Нет карточки с таким _id');
      } else if (err.name === 'CastError') {
        throw new IncorrectDataError('Передан некорректный _id');
      }
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
