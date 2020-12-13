const UserNotification = require('../models/userNotification');
const Notification = require('../models/notification');
const UserNotificationSerializer = require('../serializers/userNotificationSerializer');

module.exports = class LoadNotificationsService {
  constructor(recipientId) {
    this.recipientId = recipientId;
  }

  async perform() {
    try {
      const userNotifications = await UserNotification.find({
        recipient: this.recipientId,
      }).populate('notification');
      const notificationIds = userNotifications.map((x) => x.notification._id);
      const notifications = await Notification.find()
        .where('_id')
        .in(notificationIds)
        .populate('trackable')
        .populate('owner')
        .sort({
          createdAt: -1,
        });

      return notifications.map((x) => new UserNotificationSerializer(x).perform());
    } catch (error) {
      console.log('err', error);
    }
  }
};
