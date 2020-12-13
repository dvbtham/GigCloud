const { goingGigYes, goingGigNo, artistProfileLink, gigDetailLink } = require('../../utils/settings');
const link = require('../../utils/templates/link');

module.exports = class GigMessageService {
  constructor(notification) {
    this.notification = notification;
    this.gig = notification.trackable;
    this.owner = notification.owner;
    this.artistUrl = link(artistProfileLink + this.owner.id, this.owner.name)
    this.gigUrl = link(gigDetailLink + this.gig.slug, this.gig.title)
  }

  loadByKey() {
    let message = '';
    switch (this.notification.key) {
      case goingGigYes:
        message = `${this.artistUrl} going respone <b>YES</b> for ${this.gigUrl}`;
        break;
      case goingGigNo:
        message = `${this.artistUrl} going respone <b>NO</b> for ${this.gigUrl}`;
        break;

      default:
        break;
    }

    return message;
  }
};
