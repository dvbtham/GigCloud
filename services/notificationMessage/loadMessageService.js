const GigMessageService = require('./gigMessageService');

module.exports = class LoadMessageService {
  constructor(notification) {
    this.notification = notification;
  }

  perform() {
    let message = '';
    switch (this.notification.trackableType) {
      case 'Gig':
        message = new GigMessageService(this.notification).loadByKey();
        break;
      default:
        break;
    }

    return message;
  }
};
