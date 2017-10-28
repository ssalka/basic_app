import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import { ViewComponent } from 'lib/client/components';
import { Collection } from 'lib/common/interfaces';

interface ISmartInputProps {
  initialWidth?: number;
  rowHeight?: number;
}

interface ISmartInputState {
  rawValue: string;
  matched: {
    collection?: string;
  };
  resolved: {
    collection?: Collection;
  };
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
    rawValue: null,
    matched: {},
    resolved: {}
  };

  handleChange(newValue: string) {
    this.setState({ rawValue: newValue });
  }

  render() {
    const { initialWidth, rowHeight, ...props } = this.props;
    const { rawValue, matched, resolved } = this.state;

    return (
      <StyledSmartInput
        {...props}
        align="center"
        justify="flex-start"
        className="pt-card pt-elevation-1"
        p={0}
        px={2}
        width={initialWidth}
        style={{
          height: rowHeight,
          borderRadius: rowHeight / 2
        }}
      >
        {resolved.collection && <div>{resolved.collection.name}</div>}

        <EditableText
          placeholder="Search or Add to Library"
          onChange={this.handleChange}
          value={rawValue}
        />
      </StyledSmartInput>
    );
  }
}

const StyledSmartInput: any = styled(Flex)`
  overflow: hidden;

  .pt-editable-text {
    flex-grow: 1;

    &::before {
      box-shadow: none !important;
    }
  }
`;
