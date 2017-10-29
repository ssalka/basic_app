import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import { ViewComponent } from 'lib/client/components';
import { Collection } from 'lib/common/interfaces';

interface IIdentifier {
  type: 'collection' | 'document';
  value: string;
  resolved?: any;
}

interface ISmartInputProps {
  initialWidth?: number;
  rowHeight?: number;
}

interface ISmartInputState {
  inputValue: string;
  identifiers: IIdentifier[];
}

export default class SmartInput extends ViewComponent<
  ISmartInputProps,
  ISmartInputState
> {
  static defaultProps = {
    initialWidth: 200,
    rowHeight: 32
  };

  state: ISmartInputState = {
    inputValue: null,
    identifiers: []
  };

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleKeyDown(event) {
    if (isTabKeyEvent(event)) {
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    if (isTabKeyEvent(event)) {
      this.handleTab(event);
    }
  }

  handleTab(event) {
    if (_.isEmpty(this.state.inputValue)) return;

    // TODO: need selected search suggestion to get type
    const type = 'document';

    this.setState({
      inputValue: '',
      identifiers: this.state.identifiers.concat({
        type,
        value: event.target.value
      })
    });
  }

  render() {
    const { initialWidth, rowHeight, ...props } = this.props;
    const { identifiers, inputValue } = this.state;

    return (
      <StyledSmartInput
        {...props}
        align="stretch"
        className="pt-card pt-elevation-1"
        column={true}
        p={0}
        width={initialWidth}
        style={{
          borderRadius: rowHeight / 2,
          minHeight: rowHeight
        }}
      >
        {identifiers.map(({ value, resolved }, i) => (
          <div
            key={i}
            children={resolved ? resolved.name : value}
            style={{
              height: rowHeight,
              lineHeight: `${rowHeight}px`,
              paddingLeft: 10
            }}
          />
        ))}

        <input
          placeholder="Search or Add to Library"
          value={inputValue}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          style={{
            marginLeft: 10
          }}
        />
      </StyledSmartInput>
    );
  }
}

const isTabKeyEvent = (event): boolean => event.keyCode === 9;

const StyledSmartInput: any = styled(Flex)`
  overflow: hidden;

  * {
    height: 32px;
    line-height: ${({ style }: any) => style.minHeight}px:
    margin-left: ${({ style }: any) => style.minHeight}px:
  }

  div {
    background-color: #EEE;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #CCC;c
  }

  input {
    flex-grow: 1;
    border: 0;
    font-size: 14px;

    &::before {
      box-shadow: none !important;
    }
  }
`;
