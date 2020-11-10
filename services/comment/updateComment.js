const Comment = require('../../models/comment');
const mongoose = require('mongoose');

module.exports = class UpdateCommentService {
  constructor(req) {
    this.commentId = req.body.commentId;
    this.gigId = req.body.gigId;
    this.body = req.body.content;
    this.isReply = req.body.fromReply;
    this.user = req.session.user;
  }

  async perform() {
    try {
      if (!this.isReply) {
        const comment = await Comment.findOne({ _id: this.commentId, by: this.user._id, modelId: this.gigId });

        if (!comment) return null;

        await comment.updateOne({ body: this.body });
        return comment;
      }

      const comment = await Comment.findOne({
        'childrens._id': new mongoose.Types.ObjectId(this.commentId),
        modelId: this.gigId,
        modelName: 'Gig',
        'childrens.author._id': new mongoose.Types.ObjectId(this.user._id),
      });

      if (!comment) return null;

      await Comment.update(
        {
          'childrens._id': new mongoose.Types.ObjectId(this.commentId),
          modelId: this.gigId,
          'childrens.author._id': new mongoose.Types.ObjectId(this.user._id),
        },
        {
          $set: {
            'childrens.$.body': this.body,
          },
        },
      ).exec();

      return comment;
    } catch (_err) {
      return null;
    }
  }
};
