const { check } = require('express-validator');

const passwordChecker = check('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({
    min: 6,
  })
  .withMessage('Password must be at least 6 chars long')
  .isLength({
    max: 256,
  })
  .withMessage('Password must be at most 256 chars long');

const nameChecker = check('name')
  .isString()
  .not()
  .isEmpty()
  .withMessage('Name is required')
  .trim()
  .isLength({
    max: 256,
  })
  .withMessage('Name must be at most 256 chars long');
const emailChecker = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Email is invalid format')
  .isLength({
    max: 256,
  })
  .withMessage('Email must be at most 256 chars long');

const avatarChecker = check('avatar')
  .optional({
    nullable: true,
    checkFalsy: true,
  })
  .isURL()
  .withMessage('Avatar is invalid URL format')
  .trim()
  .isLength({
    max: 256,
  })
  .withMessage('Avatar must be at most 256 chars long');

module.exports.passwordChecker = passwordChecker;
module.exports.emailChecker = emailChecker;
module.exports.nameChecker = nameChecker;
module.exports.avatarChecker = avatarChecker;
