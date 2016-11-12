import React from 'react';
import _ from 'lodash';

import { BaseComponent } from 'lib/client/components';

module.exports = class Input extends BaseComponent {
  state = { value: "" }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ value });
  }

  render() {
    const { props, state } = this;
    return (
      <input placeholder={_.capitalize(props.name)}
        onChange={this.handleChange}
        name={props.name}
        type={props.type}
        value={state.value}
        style={props.style}
      />
    );
  }
};
