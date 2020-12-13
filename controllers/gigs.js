const { validationResult } = require('express-validator');
const ErrorPresenter = require('../presenters/error');
const Gig = require('../models/gig');
const Comment = require('../models/comment');
const UserGigPresenter = require('../presenters/user/gig');
const GigPresenter = require('../presenters/home/gig');
const authUserId = require('../middlewares/authUserId');

module.exports.getAddGig = async (req, res, next) => {
  const presenter = new UserGigPresenter({}, 'Add a gig', '/add-a-gig', new ErrorPresenter([]));
  const genres = await presenter.loadGenres();
  presenter.setGenres(genres);
  res.render('gigs/new.pug', presenter);
};

module.exports.postAddGig = async (req, res, next) => {
  const result = validationResult(req);
  const { title, venue, date, description, genre } = req.body;
  const gig = {
    title: title,
    venue: venue,
    date: date,
    artist: req.session.user._id,
    description: description,
    genre: genre,
    createdAt: new Date(),
  };
  if (!result.isEmpty()) {
    const presenter = new UserGigPresenter(gig, 'Add a gig', '/add-a-gig', new ErrorPresenter(result.array()));
    const genres = await presenter.loadGenres();
    presenter.setGenres(genres);
    return res.render('gigs/new.pug', presenter);
  }

  Gig.create(gig)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

module.exports.getGigDetail = async (req, res, next) => {
  const { slug } = req.params;
  const gig = await Gig.findOne({ slug: slug, deleted: false }).populate('artist').populate('genre').exec();
  if (!gig) {
    req.session.flash = {
      type: 'error',
      message: `Gig can't be found`,
    };
    return res.redirect('/');
  }

  const userId = authUserId(req);

  const isFollowing = await gig.isFollowing(userId);
  const isGoing = await gig.isGoing(userId);
  const presenter = new GigPresenter(gig, isFollowing, isGoing);
  const comments = await Comment.find({
    modelName: 'Gig',
    modelId: gig._id,
  })
    .populate('by')
    .sort({
      createdAt: -1, // desc
    });

  res.render('gigs/show.pug', {
    pageTitle: presenter.title,
    gig: { ...presenter },
    comments: comments,
  });
};
