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
  artist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  genres: [
    {
      genre: Schema.Types.ObjectId,
      ref: 'Genre',
    },
  ],
  description: {
    type: String,
    minlength: 6,
  },
  is_canceled: {
    type: Boolean,
    default: false,
  },
  created_at: Date,
});

module.exports = mongoose.model('Gig', gigSchema);
