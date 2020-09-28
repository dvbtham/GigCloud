module.exports = class ErrorPresenter {
  constructor(errors, type = 'client') {
    this.errors = errors;
    this.type = type;
  }

  has(key) {
    return this.errors.filter((err) => err.param === key).length > 0;
  }

  get(key) {
    const error = this.errors.find((err) => err.param === key);
    return error ? error.msg : '';
  }
};
