const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const ErrorPresenter = require('../presenters/error');
const RegisterPresenter = require('../presenters/register');
const LoginPresenter = require('../presenters/login');
const UserSession = require('../models/userSession');

module.exports.getLogin = (req, res, next) => {
  res.render('auth/login.pug', new LoginPresenter(new ErrorPresenter([])), '');
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

module.exports.postLogin = (req, res, next) => {
  const result = validationResult(req);
  const { email, password } = req.body;
  if (!result.isEmpty()) {
    const errors = new ErrorPresenter(result.array());
    return res.render('auth/login.pug', new RegisterPresenter(errors, email));
  }
  User.findOne({ email: email })
    .then((user) => {
      const errorResult = new ErrorPresenter(['Email or Password is incorrect'], 'server');
      if (!user) return res.render('auth/login.pug', new RegisterPresenter(errorResult, email));
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) return res.render('auth/login.pug', new RegisterPresenter(errorResult, email));
          req.session.isAuthenticated = true;
          req.session.user = new UserSession(user);
          res.redirect('/');
        })
        .then((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getRegister = (req, res, next) => {
  const error = new ErrorPresenter([]);
  const presenter = new RegisterPresenter(error, {});
  res.render('auth/register.pug', presenter);
};

module.exports.postRegister = (req, res, next) => {
  const result = validationResult(req);
  const { name, email, avatar, password } = req.body;
  if (!result.isEmpty()) {
    const errors = new ErrorPresenter(result.array());
    const userInfo = {
      name: name,
      avatar: avatar,
      email: email,
    };
    const presenter = new RegisterPresenter(errors, userInfo);
    return res.render('auth/register.pug', presenter);
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        avatar: avatar,
        password: hashedPassword,
        createdAt: Date.now(),
      });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
