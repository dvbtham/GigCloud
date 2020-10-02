module.exports = class UserSession {
  constructor(user) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.isCurrentUser = function (userId) {
      return this._id.toString() === userId.toString();
    };
  }
};
