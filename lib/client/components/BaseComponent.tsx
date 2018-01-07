import * as _ from 'lodash';
import { Component } from 'react';
import * as autoBind from 'react-autobind';

export default class BaseComponent<P = {}, S = {}> extends Component<P, S> {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  public bindModule(module: object): any {
    return _.mapValues(module, (item: any) => item.bind(this));
  }

  public setStateByPath<T = any>(path: string, value: T) {
    const stateKey = _(path)
      .split(/\.|\[/)
      .first();

    const newState = _(this.state)
      .pick(stateKey)
      .cloneDeep();

    _.set(newState, path, value);

    this.setState(newState);
  }

  public _toggle(...keys) {
    if (_.isEmpty(keys)) {
      return;
    }

    keys.forEach((key: string) => this.setStateByPath(key, !_.get(this.state, key)));
  }
}
