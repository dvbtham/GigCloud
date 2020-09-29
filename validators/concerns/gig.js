const { check } = require('express-validator');

const titleChecker = check('title')
  .notEmpty()
  .withMessage('Title is required')
  .isLength({
    min: 2,
  })
  .withMessage('Title must be at least 2 chars long')
  .isLength({
    max: 256,
  })
  .withMessage('Title must be at most 256 chars long');

const venueChecker = check('venue')
  .isString()
  .not()
  .isEmpty()
  .withMessage('Venue is required')
  .trim()
  .isLength({
    min: 2,
  })
  .withMessage('Venue must be at least 2 chars long')
  .isLength({
    max: 256,
  })
  .withMessage('Venue must be at most 256 chars long');

const genreChecker = check('genre').notEmpty().withMessage('Genre is required');

const dateChecker = check('date')
  .notEmpty()
  .withMessage('Date is required')
  .custom((value) => {
    const dateParams = new Date(value);
    const date = new Date();
    const currentDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    );
    if (dateParams < currentDate) return Promise.reject('Date must be greater current time');
    return Promise.resolve();
  })
  .withMessage('Date must be greater current time');

const descriptionChecker = check('description')
  .optional({
    nullable: true,
    checkFalsy: true,
  })
  .trim()
  .isLength({
    max: 1800,
  })
  .withMessage('Avatar must be at most 1800 chars long');

module.exports.titleChecker = titleChecker;
module.exports.dateChecker = dateChecker;
module.exports.genreChecker = genreChecker;
module.exports.venueChecker = venueChecker;
module.exports.descriptionChecker = descriptionChecker;
