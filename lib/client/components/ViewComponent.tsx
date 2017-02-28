declare const React;
import BaseComponent from './BaseComponent';
import request = require('lib/common/request');

export default class ViewComponent extends BaseComponent<any, any> {
  props: React.Props<any> & {
    [prop: string]: any;
  };

  post(path, body) {
    return request.post(path, body);
  }

  setStateByPath(path, value) { super.setStateByPath(path, value); }

  render() {
    return (
      <section className="container">
        {this.props.children}
      </section>
    );
  }
}
