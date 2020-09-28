const BasePresenter = require('./base');

module.exports = class RegisterPresenter extends BasePresenter {
  constructor(errors, user) {
    super(errors);
    this.errors = errors;
    this.user = user;
    this.pageTitle = 'Register';
    this.path = '/register';
  }
};
