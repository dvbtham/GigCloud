const BasePresenter = require('./base');

module.exports = class LoginPresenter extends BasePresenter {
  constructor(errors, email) {
    super(errors);
    this.errors = errors;
    this.pageTitle = 'Login';
    this.path = '/login';
    this.email = email;
  }
};
