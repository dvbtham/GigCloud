const LoadMessageService = require('../services/notificationMessage/loadMessageService');
module.exports = class UserNotificationSerializer {
  constructor(userNotification) {
    this.userNotification = userNotification;
  }

  perform() {
    return {
      message: new LoadMessageService(this.userNotification).perform(),
    };
  }
};
