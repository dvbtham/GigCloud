const { goingGigYes, goingGigNo } = require('../../utils/settings');

module.exports = class GigMessageService {
  constructor(notification) {
    this.notification = notification;
    this.gig = notification.trackable;
  }

  loadByKey() {
    let message = '';
    switch (this.notification.key) {
      case goingGigYes:
        message = `${this.notification.owner.name} going to your gig`;
        break;
      case goingGigNo:
        message = `${this.notification.owner.name} not going to a your gig`;
        break;

      default:
        break;
    }

    return message;
  }
};
