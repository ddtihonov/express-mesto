const ERROR_CODE_INCORRET_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT_MISTAKE = 500;

const regexUrl = /ht{1,2}ps?:\/\/[a-z0-9\\-]+\.[a-z0-9]{2,3}\S*/;

module.exports = {
  ERROR_CODE_INCORRET_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT_MISTAKE,
  regexUrl,
};
