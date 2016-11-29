import BaseComponent from './BaseComponent';
import { request } from 'lib/common';

class ViewComponent extends BaseComponent {
  post(path, body) {
    return request.post(path, body);
  }

  toggle(...args) { super.toggle(...args); }

  render() {
    return (
      <section className="container">
        {this.props.children}
      </section>
    );
  }
};

module.exports = ViewComponent;
