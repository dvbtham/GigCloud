const Comment = require('../../models/comment');
const mongoose = require('mongoose');

module.exports = class LoadCommentService {
  constructor(req) {
    this.commentId = req.params.commentId;
    this.gigId = req.params.gigId;
  }

  async perform() {
    return await Comment.findOne({
      _id: this.commentId,
      modelId: this.gigId,
      modelName: 'Gig',
    });
  }

  async findReply() {
    const comment = await Comment.findOne({
      'childrens._id': new mongoose.Types.ObjectId(this.commentId),
      modelId: this.gigId,
      modelName: 'Gig',
    });

    const index = comment.childrens.findIndex((reply) => reply._id.toString() === this.commentId.toString());
    return index >= 0 ? comment.childrens[index] : null;
  }
};
