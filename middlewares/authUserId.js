module.exports = function (req) {
  return req.session.isAuthenticated ? req.session.user._id : undefined;
};
