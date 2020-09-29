const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gigSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 256,
  },
  venue: {
    type: String,
    required: true,
    maxlength: 256,
  },
  date: {
    type: Date,
    required: true,
  },
  artist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  genre: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Genre',
  },
  description: {
    type: String,
    maxlength: 1800,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
  createdAt: Date,
});

module.exports = mongoose.model('Gig', gigSchema);
