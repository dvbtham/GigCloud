const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  gig: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Gig',
  },
  attendee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
