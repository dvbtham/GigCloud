const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  is_receive_notification: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Following', followingSchema);
