declare const React;
import BaseComponent from './BaseComponent';
import request = require('lib/common/request');

export default class ViewComponent<P, S> extends BaseComponent<P, S> {
  public post(path, body) {
    return request.post(path, body);
  }

  public setStateByPath(path, value) { super.setStateByPath(path, value); }

  public render() {
    return (
      <section className="container">
        {this.props.children}
      </section>
    );
  }
}
