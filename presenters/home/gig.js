module.exports = class GigPresenter {
  constructor(gig, isFollowing, isGoing) {
    this._id = gig._id;
    this.title = gig.title;
    this.venue = gig.venue;
    this.artist = gig.artist;
    this.date = gig.date;
    this.genre = gig.genre;
    this.isFollowing = isFollowing;
    this.isGoing = isGoing;
  }
};
