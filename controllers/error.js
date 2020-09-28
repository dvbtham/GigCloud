module.exports.getNotFoundPage = (req, res, next) => {
  res.render('error.pug', { path: '' });
};
