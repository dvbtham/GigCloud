const Following = require('../../models/following');

module.exports = class FollowingService {
  constructor(followee, follower) {
    this.followee = followee;
    this.follower = follower;
  }

  async perform() {
    const following = await Following.findOne({ followee: this.followee._id, follower: this.follower._id }).exec();

    if (!following) {
      const result = await Following.create({
        followee: this.followee._id,
        follower: this.follower._id,
      });

      if (result) {
        return {
          type: 'success',
          message: `You are following ${this.followee.name} now`,
        };
      } else {
        return {
          type: 'error',
          message: 'Error occurs while following an artist',
        };
      }
    }

    await Following.deleteOne({ _id: following._id });

    return {
      type: 'success',
      message: `You are unfollowed ${this.followee.name}`,
    };
  }
};
