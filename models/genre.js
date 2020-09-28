const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 256,
  },
});

module.exports = mongoose.model('Genre', genreSchema);
