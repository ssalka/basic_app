import { Component } from 'react';
import autoBind from 'react-autobind';
import { get, set, cloneDeep, isEmpty } from 'lodash';

module.exports = class BaseComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  setStateByPath(path, value) {
    const state = cloneDeep(this.state);
    set(state, path, value);
    this.setState(state);
  }

  _toggle(...keys) {
    if (isEmpty(keys)) return;

    keys.forEach(key => this.setStateByPath(
      key, !get(this.state, key)
    ));
  }

};
