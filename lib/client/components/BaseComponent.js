import { Component } from 'react';
import autoBind from 'react-autobind';
import { isEmpty, isObject, values } from 'lodash';

module.exports = class BaseComponent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  toggle(...keys) {
    if (isEmpty(keys)) return;
    if (isObject(keys[0])) {
      keys = values(keys[0]);
    }

    keys.forEach(key => this.setState({
      [key]: !this.state[key]
    }));
  }
};
