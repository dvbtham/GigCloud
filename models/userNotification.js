const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userNotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  notification: {
    type: Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
    index: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    index: true,
  },
});

module.exports = mongoose.model('UserNotification', userNotificationSchema);
