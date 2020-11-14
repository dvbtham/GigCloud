const Notification = require('../models/notification');
const UserNotification = require('../models/userNotification');

module.exports = class NotificationService {
  constructor(owner, trackable, key, parameters, recipients) {
    this.owner = owner;
    this.trackable = trackable;
    this.key = key;
    this.parameters = parameters;
    this.recipients = recipients;
  }

  async create() {
    const session = await Notification.startSession();
    session.startTransaction();
    try {
      const notification = await Notification.create({
        owner: this.owner.id,
        ownerType: this.owner.modelName,
        trackable: this.trackable.id,
        trackableType: this.trackable.modelName,
        key: this.key,
        parameters: JSON.stringify(this.parameters),
        createdAt: new Date(),
      });

      await UserNotification.insertMany(this.userNotifications(notification._id));

      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (_err) {
      await session.abortTransaction();
      session.endSession();
      return false;
    }
  }

  userNotifications(notification) {
    return this.recipients.map((recipient) => ({ recipient, isRead: false, notification, createdAt: new Date() }));
  }
};
