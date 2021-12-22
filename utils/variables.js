const validator = require('validator');
const regexUrl = /https?:\/\/[\w{1,s}\W{1,s}]#?/;

const ValidationLink = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Некорректный URL-адрес');
};

module.exports = {
  regexUrl,
  ValidationLink,
};
