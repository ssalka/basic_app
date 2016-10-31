const BaseComponent = require('./BaseComponent');
const { request } = require('lib/common');

class ViewComponent extends BaseComponent {
  post(path, body) {
    return request.post(path, body);
  }

  toggle(...args) { super.toggle(...args); }

  render() {
    return (
      <section>
      </section>
    )
  }
};


module.exports = ViewComponent;
