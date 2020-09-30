const Attendance = require('../../models/attendance');

module.exports = class AttendGigService {
  constructor(gig, attendee) {
    this.gig = gig;
    this.attendee = attendee;
  }

  async perform() {
    const attendance = await Attendance.findOne({ gig: this.gig._id, attendee: this.attendee._id }).exec();

    if (!attendance) {
      const result = await Attendance.create({
        gig: this.gig._id,
        attendee: this.attendee._id,
      });

      if (result) {
        return {
          type: 'success',
          message: `You're going to this gig ${this.gig.title}`,
        };
      } else {
        return {
          type: 'error',
          message: `Error occurs while going to ${this.gig.title}`,
        };
      }
    }

    const going = await Attendance.updateOne({ _id: attendance._id }, { $set: { isCanceled: !attendance.isCanceled } });

    if (going.isCanceled) {
      return {
        type: 'success',
        message: `You're not going to this gig ${this.gig.title}`,
      };
    } else {
      return {
        type: 'success',
        message: `You're going to this gig ${this.gig.title}`,
      };
    }
  }
};
