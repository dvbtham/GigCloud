const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerType',
  },
  ownerType: {
    type: String,
    required: true,
    enum: ['User'],
  },
  trackable: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'trackableType',
  },
  trackableType: {
    type: String,
    required: true,
    enum: ['Gig'],
  },
  key: {
    type: String,
    required: true,
    index: true,
  },
  parameters: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    index: true,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
