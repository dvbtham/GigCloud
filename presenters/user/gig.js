const BasePresenter = require('../base');
const Genre = require('../../models/genre');

module.exports = class UserGigPresenter extends BasePresenter {
  constructor(gig, pageTitle, path, errors) {
    super(errors);
    this.errors = errors;
    this.pageTitle = pageTitle;
    this.path = path;
    this.gig = gig;
  }

  setGenres(genres) {
    this.genres = genres;
  }

  async loadGenres() {
    try {
      return await Genre.where({}).sort('title').exec();
    } catch (err) {
      return console.log(err);
    }
  }
};
