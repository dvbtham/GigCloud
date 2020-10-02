const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: { type: String, required: true },
  modelId: {
    type: Schema.Types.ObjectId,
    required: true,
    // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
    // will look at the `modelName` property to find the right model.
    refPath: 'modelName',
  },
  modelName: {
    type: String,
    required: true,
    enum: ['Gig'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  by: {
    ref: 'User',
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
