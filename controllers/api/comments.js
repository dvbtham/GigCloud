const { validationResult } = require('express-validator');
const Comment = require('../../models/comment');
const mongoose = require('mongoose');

module.exports.postReply = async (req, res, next) => {
  const result = validationResult(req);
  const { gigId, content, commentId } = req.body;
  if (!result.isEmpty()) {
    return res
      .status(422)
      .json({ errors: result.array().map((err) => err.msg) });
  }

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) return res.status(404).json({ errors: ['Comment not found'] });

  const reply = {
    _id: mongoose.Types.ObjectId(),
    body: content,
    gigId,
    author: req.session.user,
    createdAt: new Date(),
  };

  Comment.updateOne({ _id: comment._id }, { $push: { childrens: reply } })
    .then(() => res.json(reply))
    .catch((err) => {
      return res.status(500).json({ errors: ['Invalid data'] });
    });
};
