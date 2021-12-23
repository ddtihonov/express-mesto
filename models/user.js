const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { regexUrl } = require('../utils/variables');
const AuthentificationError = require('../errors/AuthentificationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => regexUrl.test(avatar),
      message: 'Ссылка некорректна!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: validator.isEmail},
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// проверка почты и пароля
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!password || password.length < 8) {
    throw new AuthentificationError('Неправильные почта или пароль');
  }
  return this.findOne({ email }).select('+password')
  .orFail(() => {
    throw new AuthentificationError('Неправильные почта или пароль');
  })
  .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new AuthentificationError('Неправильные почта или пароль');
        }
          return user;
      }));
    };

module.exports = mongoose.model('user', userSchema);
