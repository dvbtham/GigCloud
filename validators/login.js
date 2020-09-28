const { emailChecker, passwordChecker } = require('./concerns/user');

const loginValidators = [emailChecker, passwordChecker];

module.exports = loginValidators;
