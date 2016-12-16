import BaseComponent from './BaseComponent';
import { request } from 'lib/common';
import _ from 'lodash';

class ViewComponent extends BaseComponent {
  post(path, body) {
    return request.post(path, body);
  }

  toggle(...args) { super.toggle(...args); }


  setStateByPath(path, value) {
    const state = _.cloneDeep(this.state);
    _.set(state, path, value);
    this.setState(state);
  }

  render() {
    return (
      <section className="container">
        {this.props.children}
      </section>
    );
  }
};

module.exports = ViewComponent;
