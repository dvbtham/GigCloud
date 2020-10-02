const { check } = require('express-validator');

const bodyChecker = check('content').notEmpty().withMessage('Body is required');

const commentValidators = [bodyChecker];

module.exports = commentValidators;
