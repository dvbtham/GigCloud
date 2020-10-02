const { validationResult } = require('express-validator');
const ErrorPresenter = require('../presenters/error');
const Comment = require('../models/comment');

module.exports.postAddComment = async (req, res, next) => {
  const result = validationResult(req);
  const { gigId, content } = req.body;

  if (!result.isEmpty()) {
    req.session.flash = {
      type: 'error',
      message: result.array()[0].msg,
    };
    return res.redirect(req.get('referer'));
  }

  Comment.create({
    body: content,
    modelId: gigId,
    modelName: 'Gig',
    by: req.session.user._id,
  }).then(() => {
    res.redirect(req.get('referer'));
  });
};
