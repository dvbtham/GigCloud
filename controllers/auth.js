module.exports.getLogin = (req, res, next) => {
  res.render('auth/login.pug', {
    pageTitle: 'Login',
    path: '/login',
  });
};

module.exports.postLogin = (req, res, next) => {
  res.redirect('/');
};
