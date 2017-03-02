declare const _;
import { Component } from 'react';
import * as autoBind from 'react-autobind';

export default class BaseComponent<P, S> extends Component<P, S> {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  setStateByPath(path, value) {
    const state = _.cloneDeep(this.state);
    _.set(state, path, value);
    this.setState(state);
  }

  _toggle(...keys) {
    if (_.isEmpty(keys)) return;

    keys.forEach(key => this.setStateByPath(
      key, !_.get(this.state, key)
    ));
  }
};