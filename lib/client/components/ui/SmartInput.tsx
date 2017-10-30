import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import { ViewComponent } from 'lib/client/components';
import { Collection } from 'lib/common/interfaces';

export interface ISmartInputItem {
  type: string;
  name: string;
  resolved?: any;
}

interface ISmartInputProps extends React.HTMLProps<HTMLDivElement> {
  initialWidth?: number;
  rowHeight?: number;
  collections: Collection[];
  inputStyle?: React.CSSProperties;
}

interface ISmartInputState {
  inputValue: string;
  identifiers: ISmartInputItem[];
  options: ISmartInputItem[];
}

export default class SmartInput extends ViewComponent<
  ISmartInputProps,
  ISmartInputState
> {
  static defaultProps = {
    initialWidth: 200,
    rowHeight: 32,
    collections: []
  };

  state: ISmartInputState = {
    inputValue: null,
    identifiers: [],
    options: this.props.collections.map((collection: Collection): ISmartInputItem => ({
      type: 'collection',
      name: collection.name,
      resolved: collection
    }))
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
        name: event.target.value
      })
    });
  }

  matchAgainstInput = (item: ISmartInputItem): boolean =>
    !!this.state.inputValue && _.at(item, 'name', 'type').some(this.valueMatchesInput);

  valueMatchesInput = (val: string): boolean =>
    !!val && val.toLowerCase().includes(this.state.inputValue);

  render() {
    const { initialWidth, rowHeight, inputStyle, style, ...props } = this.props;
    const { identifiers, inputValue, options } = this.state;
    const borderRadius = rowHeight / 2;

    const matchedOptions = options.filter(this.matchAgainstInput);

    return (
      <StyledSmartInput rowHeight={rowHeight} style={{ position: 'relative', ...style }}>
        {!!matchedOptions.length && (
          <Flex
            // TODO: replace with react-virtualized-select (need labelKey)
            className="options pt-callout pt-elevation-2"
            align="stretch"
            column={true}
          >
            {[{ type: inputValue }]
              .concat(matchedOptions)
              .map((item: Partial<ISmartInputItem>) => (
                <div className="option row">{item.name}</div>
              ))}
          </Flex>
        )}

        <Flex
          {...props}
          align="stretch"
          className="select pt-card pt-elevation-0"
          column={true}
          p={0}
          width={initialWidth}
          style={{
            borderRadius,
            minHeight: rowHeight,
            flexGrow: 1,
            ...inputStyle
          }}
        >
          {identifiers.map(({ type, name, resolved }, i) => (
            <Flex
              className="identifier row"
              align="center"
              justify="flex-start"
              px={10}
              key={i}
            >
              <span className="pt-tag" style={{ marginRight: 5 }}>
                {_.capitalize(resolved ? resolved._model : type)}
              </span>

              <span>{resolved ? resolved.name : name}</span>
            </Flex>
          ))}

          <input
            // TODO: replace with react-virtualized-select (need labelKey)
            placeholder="Search or Add to Library"
            className="row"
            value={inputValue}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            style={{
              borderRadius: identifiers.length
                ? `0 0 ${borderRadius}px ${borderRadius}px`
                : borderRadius
            }}
          />
        </Flex>
      </StyledSmartInput>
    );
  }
}

const isTabKeyEvent = (event): boolean => event.keyCode === 9;

const StyledSmartInput: any = styled.div`
  .row {
    height: ${({ rowHeight }: any) => rowHeight}px !important;
    line-height: ${({ rowHeight }: any) => rowHeight}px !important;
    padding-left: 10px !important;
  }

  .select {
    overflow: hidden;

    &, & > * {
      z-index: 1;
    }

    .identifier {
      background-color: #EEE;
      margin-bottom: 0 !important;
      border-bottom: 1px solid #CCC;
      line-height: ${({ rowHeight }: any) => rowHeight}px !important:
    }

    input {
      vertical-align: middle;
      border-radius: ${({ rowHeight }: any) => rowHeight / 2}px;
      line-height: ${({ rowHeight }: any) => rowHeight}px;
      padding: 0;
      font-size: 14px;
      width: 100%;
      border: 1px solid #DDD;

      &::before {
        box-shadow: none !important;
      }
    }
  }

  .options {
    z-index: 0;
    position: absolute;
    top: 0;
    background-color: white;
    width: 100%;
    border-radius: 16px;
    background-color: #FCFCFC;

    .option {
      line-height: ${({ rowHeight }: any) => rowHeight}px;
      vertical-align: middle;

      &:not(:last-of-type):not(:first-of-type) {
        border-bottom: 1px solid #EAEAEA;
      }
    }
  }
`;
