const Attendance = require('../../models/attendance');

module.exports = class AttendGigService {
  constructor(gig, attendee) {
    this.gig = gig;
    this.attendee = attendee;
  }

  async perform() {
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
      { new: true }
    );

    if (going.isCanceled) {
      return {
        type: 'success',
        message: `You're not going to a gig ${this.gig.title}`,
      };
    }

    return {
      type: 'success',
      message: `You're going to a gig ${this.gig.title}`,
    };
  }
};
