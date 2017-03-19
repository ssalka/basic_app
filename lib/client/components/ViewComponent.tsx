declare const React;
import BaseComponent from './BaseComponent';
import { ReactProps } from 'lib/client/interfaces';
import request = require('lib/common/request');

export default class ViewComponent<P extends ReactProps, S> extends BaseComponent<P, S> {
  public post(path, body) {
    return request.post(path, body);
  }

  public setStateByPath(path, value) { super.setStateByPath(path, value); }

  public render() {
    const { children, className } = this.props;

    return (
      <section className={`container ${className}`}>
        {children}
      </section>
    );
  }
}
