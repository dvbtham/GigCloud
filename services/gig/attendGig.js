const Attendance = require('../../models/attendance');
const { goingGigNo, goingGigYes } = require('../../utils/settings');
const NotificationService = require('../notificationService');
module.exports = class AttendGigService {
  constructor(gig, attendee) {
    this.gig = gig;
    this.attendee = attendee;
  }

  async perform(isSendNotification = true) {
    try {
      const attendance = await Attendance.findOne({
        gig: this.gig._id,
        attendee: this.attendee._id,
      }).exec();

      if (!attendance) {
        const result = await Attendance.create({
          gig: this.gig._id,
          attendee: this.attendee._id,
        });

        if (result) {
          await this.shouldSendNotification(isSendNotification);
          return {
            type: 'success',
            message: `You're going to a gig ${this.gig.title}`,
          };
        }

        return {
          type: 'error',
          message: `Error occurs while going to a gig ${this.gig.title}`,
        };
      }

      const going = await Attendance.findOneAndUpdate(
        { _id: attendance._id },
        { isCanceled: !attendance.isCanceled },
        { new: true },
      );

      if (going.isCanceled) {
        await this.shouldSendNotification(isSendNotification, goingGigNo);
        return {
          type: 'success',
          message: `You're not going to a gig ${this.gig.title}`,
        };
      }

      await this.shouldSendNotification(isSendNotification, goingGigYes);

      return {
        type: 'success',
        message: `You're going to a gig ${this.gig.title}`,
      };
    } catch (err) {
      return {
        type: 'error',
        message: err.message,
      };
    }
  }

  async shouldSendNotification(isSendNotification, key = goingGigYes) {
    if (!isSendNotification) return false;

    const owner = { id: this.attendee._id, modelName: 'User' };
    const trackable = { id: this.gig._id, modelName: 'Gig' };
    await new NotificationService(owner, trackable, key, {}, [this.gig.artist._id]).create();
  }
};
