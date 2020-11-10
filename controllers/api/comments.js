const { validationResult } = require('express-validator');
const Comment = require('../../models/comment');
const mongoose = require('mongoose');
const LoadCommentService = require('../../services/comment/loadComment');
const UpdateCommentService = require('../../services/comment/updateComment');

module.exports.getGigComment = async (req, res) => {
  try {
    const service = new LoadCommentService(req);
    const { fromReply } = req.query;
    const comment = fromReply === 'true' ? await service.findReply() : await service.perform();

    if (!comment) return res.status(404).json({ errors: ['Comment not found'] });

    return res.json(comment);
  } catch (err) {
    return res.status(500).json({ errors: ['Invalid comment data'] });
  }
};

module.exports.putGigComment = async (req, res) => {
  try {
    const comment = await new UpdateCommentService(req).perform();

    if (!comment) {
      return res.status(500).json({ errors: ['Failed to update.'] });
    }

    return res.json(comment);
  } catch (err) {
    return res.status(500).json({ errors: ['Failed to update.'] });
  }
};

module.exports.postReply = async (req, res) => {
  try {
    const result = validationResult(req);
    const { gigId, content, commentId } = req.body;
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array().map((err) => err.msg) });
    }

    const comment = await Comment.findOne({
      _id: commentId,
      modelId: gigId,
      modelName: 'Gig',
    });

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
      .catch(() => {
        return res.status(500).json({ errors: ['Invalid comment data'] });
      });
  } catch (err) {
    return res.status(500).json({ errors: ['Invalid comment data'] });
  }
};
