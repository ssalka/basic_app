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

  public setStateByPath(path, value) {
    const state = _.cloneDeep(this.state);
    _.set(state, path, value);
    this.setState(state);
  }

  public _toggle(...keys) {
    if (_.isEmpty(keys)) {
      return;
    }

    keys.forEach((key: string) => this.setStateByPath(key, !_.get(this.state, key)));
  }
}
