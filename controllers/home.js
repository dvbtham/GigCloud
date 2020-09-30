const Gig = require('../models/gig');
const User = require('../models/user');
const Following = require('../models/following');
const GigPresenter = require('../presenters/home/gig');
const FollowingService = require('../services/gig/following');
const AttendGigService = require('../services/gig/attendGig');

async function handlePresenter(req) {
  const upcommingGigs = await Gig.upcommingGigs(req.query.q);
  return upcommingGigs.map(async (gig) => {
    const followerId = req.session.isAuthenticated ? req.session.user._id : undefined;
    const isFollowing = await gig.isFollowing(followerId, gig.artist);
    const isGoing = await gig.isGoing(gig._id, followerId);
    return new GigPresenter(gig, isFollowing, isGoing);
  });
}

module.exports.getUpcommingGigs = async (req, res, next) => {
  const pageTitle = 'Publish your gigs to the world';
  handlePresenter(req)
    .then((gigs) => Promise.all(gigs))
    .then((gigs) => {
      res.render('home.pug', {
        path: '/',
        pageTitle: pageTitle,
        gigs: gigs,
        q: req.query.q,
        errorMessage: res.locals.flash,
      });
    })
    .catch(() => {
      res.render('home.pug', {
        path: '/',
        pageTitle: pageTitle,
        gigs: [],
        q: req.query.q,
        errorMessage: res.locals.flash,
      });
    });
};

module.exports.postFollowGig = async (req, res, next) => {
  try {
    const artistId = req.body.artist;
    const artist = await User.findById(artistId).exec();

    if (!artist) {
      req.session.flash = {
        type: 'error',
        message: 'The artist is not available',
      };
      return res.redirect('/');
    }

    const following = await new FollowingService(artist, req.session.user).perform();

    req.session.flash = following;
    res.redirect('/');
  } catch (error) {
    req.session.flash = {
      type: 'error',
      message: 'Request is invalid',
    };
    res.redirect('/');
  }
};

module.exports.postGoingGig = async (req, res, next) => {
  try {
    const gigId = req.body.gigId;
    const gig = await Gig.findById(gigId).exec();

    if (!gig) {
      req.session.flash = {
        type: 'error',
        message: 'The gig is not available',
      };
      return res.redirect('/');
    }

    const going = await new AttendGigService(gig, req.session.user).perform();
    req.session.flash = going;
    res.redirect('/');
  } catch (error) {
    console.log(error);
    req.session.flash = {
      type: 'error',
      message: 'Request is invalid',
    };
    res.redirect('/');
  }
};
