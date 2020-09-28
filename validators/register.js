const { check } = require('express-validator');
const User = require('../models/user');
const { avatarChecker, nameChecker, emailChecker, passwordChecker } = require('./concerns/user');

const registerValidators = [
  nameChecker,
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid format')
    .isLength({
      max: 256,
    })
    .withMessage('Email must be at most 256 chars long')
    .custom((value) => {
      return User.findOne({ email: value })
        .exec()
        .then((user) => {
          if (user) {
            return Promise.reject('Email already in use');
          }
        });
    })
    .withMessage('Email already in use'),
  avatarChecker,
  passwordChecker,
  check('passwordConfirmation')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value == req.body.password) return Promise.resolve();
      return Promise.reject('Password confirmation is not match');
    })
    .withMessage('Password confirmation is not match'),
];

module.exports = registerValidators;
