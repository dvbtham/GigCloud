const Gig = require('../models/gig');
const User = require('../models/user');
const GigPresenter = require('../presenters/home/gig');
const FollowingService = require('../services/gig/following');
const AttendGigService = require('../services/gig/attendGig');
const UserSession = require('../models/userSession');
const authUserId = require('../middlewares/authUserId');

async function handlePresenter(req) {
  const upcommingGigs = await Gig.upcommingGigs(req.query.q);
  return upcommingGigs.map(async (gig) => {
    const userId = authUserId(req);
    const isFollowing = await gig.isFollowing(userId);
    const isGoing = await gig.isGoing(userId);
    return new GigPresenter(gig, isFollowing, isGoing);
  });
}

module.exports.getUpcommingGigs = async (req, res) => {
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

module.exports.postFollowGig = async (req, res) => {
  try {
    const artistId = req.body.artist;
    const artist = await User.findById(artistId).exec();

    if (!artist) {
      req.session.flash = {
        type: 'error',
        message: 'The artist is not available',
      };
      return res.redirect(req.get('referer'));
    }

    const user = new UserSession(artist);

    if (user.isCurrentUser(req.session.user._id)) {
      req.session.flash = {
        type: 'error',
        message: "Can't follow your own",
      };
      return res.redirect(req.get('referer'));
    }

    const following = await new FollowingService(user, req.session.user).perform();

    req.session.flash = following;
    res.redirect(req.get('referer'));
  } catch (error) {
    req.session.flash = {
      type: 'error',
      message: 'Request is invalid',
    };
    res.redirect(req.get('referer'));
  }
};

module.exports.postGoingGig = async (req, res) => {
  try {
    const gigId = req.body.gigId;
    const gig = await Gig.findOne({ _id: gigId, deleted: false }).exec();

    if (!gig) {
      req.session.flash = {
        type: 'error',
        message: 'The gig is not available',
      };
      return res.redirect(req.get('referer'));
    }

    const going = await new AttendGigService(gig, req.session.user).perform();
    req.session.flash = going;
    res.redirect(req.get('referer'));
  } catch (error) {
    console.log(error);
    req.session.flash = {
      type: 'error',
      message: 'Request is invalid',
    };
    res.redirect(req.get('referer'));
  }
};
