const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 256,
  },
  email: {
    type: String,
    required: true,
    maxlength: 256,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 256,
  },
  created_at: Date,
  avatar: String,
});

module.exports = mongoose.model('User', userSchema);
