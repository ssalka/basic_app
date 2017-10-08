declare const React;
import BaseComponent from './BaseComponent';
import { ReactProps } from 'lib/common/interfaces';
import request from 'lib/common/request';

export default class ViewComponent<
  P = React.HTMLAttributes<HTMLElement>,
  S = {}
> extends BaseComponent<P, S> {
  post(path, body) {
    return request.post(path, body);
  }

  setStateByPath(path, value) {
    super.setStateByPath(path, value);
  }

  render() {
    const { children, className } = this.props as any;

    return <section className={`container ${className}`}>{children}</section>;
  }
}
