import { Component } from 'react';
import autoBind from 'react-autobind';
import { isEmpty, filter } from 'lodash';

module.exports = class BaseComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }
  
  toggle(...keys) {
    if (isEmpty(keys)) return;
    if (keys[0] instanceof Object) {
      keys = filter(keys[0]);
    }

    keys.forEach(this._toggle);
  }

  _toggle(key) {
    this.setState({
      [key]: !this.state[key]
    });
  }
};
