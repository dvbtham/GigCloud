const mongoose = require('mongoose');
const Genre = require('../models/genre');
const Attendance = require('../models/attendance');
const User = require('../models/user');
const Following = require('../models/following');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const gigSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 256,
  },
  slug: {
    type: String,
    slug: 'title',
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

gigSchema.statics.upcommingGigs = async function (term) {
  const date = new Date();
  date.setHours(date.getHours() - 8);
  const gigs = this.where('date').gte(date).populate('genre').populate('artist').sort({ date: 'asc' });

  if (!term || term === '') return await gigs;

  const searchOptions = { $regex: term, $options: 'i' };
  const genres = await Genre.find({ title: searchOptions }).select('_id');
  const artists = await User.find({ name: searchOptions }).select('_id');

  const searchedGigs = gigs.find({
    $or: [
      { title: searchOptions },
      { description: searchOptions },
      { genre: { $in: genres.map((genre) => genre._id) } },
      { artist: { $in: artists.map((artist) => artist._id) } },
    ],
  });
  return await searchedGigs;
};

gigSchema.methods.isFollowing = async function (followerId) {
  const following = await Following.findOne({ follower: followerId, followee: this.artist._id }).exec();
  return following !== null;
};

gigSchema.methods.isGoing = async function (attendeeId) {
  const attendance = await Attendance.findOne({
    gig: this._id,
    attendee: attendeeId,
    isCanceled: false,
  }).exec();
  return attendance !== null;
};

module.exports = mongoose.model('Gig', gigSchema);
