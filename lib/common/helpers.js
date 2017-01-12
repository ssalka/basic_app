module.exports = {
  mapToKeyValueArray(object) {
    return _(object).pickBy().map(
      (val, key) => ({ [key]: val })
    ).value();
  }
};
