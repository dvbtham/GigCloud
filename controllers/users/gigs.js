const Gig = require('../../models/gig');
const MyGigsPresenter = require('../../presenters/user/gigs');
const authUserId = require('../../middlewares/authUserId');
const UserGigPresenter = require('../../presenters/user/gig');
const ErrorPresenter = require('../../presenters/error');
const { validationResult } = require('express-validator');
const NotificationService = require('../../services/notificationService');
const Attendance = require('../../models/attendance');
const { editGigInfoNotify, myGigsLink } = require('../../utils/settings');

module.exports.getMyGigs = async (req, res, next) => {
  const gigs = await Gig.where({ artist: authUserId(req) }).populate('genre');
  const presenter = new MyGigsPresenter(gigs, 'My gigs', myGigsLink);
  res.render('users/gigs/list.pug', presenter);
};

module.exports.getEditGig = async (req, res, next) => {
  const gig = await Gig.findOne({ slug: req.params.slug, artist: authUserId(req), deleted: false });
  if (!gig) {
    req.session.flash = {
      type: 'error',
      message: `Gig can't be found`,
    };
    return res.redirect(myGigsLink);
  }
  const error = new ErrorPresenter([]);
  const presenter = new UserGigPresenter(gig, gig.title, myGigsLink, error);
  const genres = await presenter.loadGenres();
  presenter.setGenres(genres);
  res.render('users/gigs/edit.pug', presenter);
};

module.exports.postEditGig = async (req, res, next) => {
  try {
    const result = validationResult(req);
    const { title, venue, date, description, genre, slug } = req.body;
    const gigParams = {
      title: title,
      venue: venue,
      date: date,
      description: description,
      genre: genre,
      slug: slug,
    };

    if (!result.isEmpty()) {
      const presenter = new UserGigPresenter(gigParams, title, myGigsLink, new ErrorPresenter(result.array()));
      const genres = await presenter.loadGenres();
      presenter.setGenres(genres);
      return res.render('users/gigs/edit.pug', presenter);
    }

    const gig = await Gig.findOne({ slug, artist: authUserId(req), deleted: false });

    if (!gig) {
      req.session.flash = {
        type: 'error',
        message: `Gig can't be found`,
      };
      return res.redirect(myGigsLink);
    }

    gig.title = title;
    gig.venue = venue;
    gig.date = date;
    gig.description = description;
    gig.genre = genre;
    await gig.save();

    const owner = { id: gig.artist, modelName: 'User' };
    const trackable = { id: gig._id, modelName: 'Gig' };
    const recipients = await Attendance.find({ gig: gig._id, isCanceled: false });
    if (recipients.length === 0) return res.redirect(myGigsLink);

    const attendees = recipients.map((x) => x.attendee);
    await new NotificationService(owner, trackable, editGigInfoNotify, {}, attendees).create();
    res.redirect(myGigsLink);
  } catch (err) {
    req.session.flash = {
      type: 'error',
      message: `An error occurred while updating the gig`,
    };
    res.redirect(myGigsLink);
  }
};
