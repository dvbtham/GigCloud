const { validationResult } = require('express-validator');
const ErrorPresenter = require('../presenters/error');
const Gig = require('../models/gig');
const UserGigPresenter = require('../presenters/user/gig');

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
