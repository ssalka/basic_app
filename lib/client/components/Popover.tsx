import * as React from 'react';
import { findDOMNode } from 'react-dom';
import MaterialPopover from 'material-ui/Popover';

interface IProps extends React.HTMLAttributes<any> {
  target: JSX.Element;
  anchorOrigin?: {
    vertical: number | 'center' | 'top' | 'bottom';
    horizontal: number | 'center' | 'left' | 'right';
  };
  transformOrigin?: {
    vertical: number | 'center' | 'top' | 'bottom';
    horizontal: number | 'center' | 'left' | 'right';
  };
}

export default class Popover extends React.Component<IProps, any> {
  static defaultProps: Partial<IProps> = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center'
    }
  };

  state = {
    open: false,
    anchorEl: null
  };

  button = null;

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value
    });
  }

  handleClickButton = () => {
    this.setState({
      open: true,
      anchorEl: findDOMNode(this.button)
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  setRef = node => {
    this.button = node;
  }

  render() {
    const {
      open,
      anchorEl,
    } = this.state;

    return (
      <div>
        <div
          ref={this.setRef}
          onClick={this.handleClickButton}
        >
          {this.props.target}
        </div>
        <MaterialPopover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={this.handleRequestClose}
          anchorOrigin={this.props.anchorOrigin}
          transformOrigin={this.props.transformOrigin}
        >
          {this.props.children}
        </MaterialPopover>
      </div>
    );
  }
}
