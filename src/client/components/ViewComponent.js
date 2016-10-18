const BaseComponent = require('./BaseComponent.js');
const { request, iterable } = require('../utils');

class ViewComponent extends BaseComponent {
  post(path, body) {
    return request.post(path, body);
  }

  toggle(...args) { super.toggle(...args); }

  render() {
    return (
      <section></section>
    )
  }
};


module.exports = ViewComponent;
