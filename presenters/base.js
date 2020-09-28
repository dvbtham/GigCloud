module.exports = class BasePresenter {
  constructor(pageTitle, path, errors) {
    this.pageTitle = pageTitle;
    this.path = path;
    this.errors = errors;
  }
};
