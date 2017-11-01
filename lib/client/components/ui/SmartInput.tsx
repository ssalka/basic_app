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
  matchedOptions: ISmartInputItem[];
  selectedOptionIndex: number;
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
    })),
    matchedOptions: [],
    selectedOptionIndex: -1
  };

  handleChange({ target: { value } }) {
    this.setState({
      inputValue: value,
      matchedOptions: value ? this.state.options.filter(this.matchAgainst(value)) : []
    });
  }

  handleKeyDown(event) {
    if (isTabKeyEvent(event)) {
      event.preventDefault();
    }
  }

  handleKeyUp(event) {
    if (isTabKeyEvent(event)) {
      this.handleTabKeyEvent(event);
    } else if (isUpArrowKeyEvent(event) || isDownArrowKeyEvent(event)) {
      this.handleArrowKeyEvent(event);
    } else if (isEnterKeyEvent(event)) {
      this.handleSubmit();
    }
  }

  handleTabKeyEvent(event) {
    if (_.isEmpty(this.state.inputValue)) return;

    const newIdentifier: ISmartInputItem = (() => {
      if (this.state.selectedOptionIndex >= 0) {
        return this.state.matchedOptions[this.state.selectedOptionIndex];
      } else if (this.state.matchedOptions.length === 1) {
        return this.state.matchedOptions[0];
      } else {
        return { type: 'document', name: event.target.value };
      }
    })();

    this.setState({
      inputValue: '',
      matchedOptions: [],
      identifiers: this.state.identifiers.concat(newIdentifier),
      selectedOptionIndex: -1
    });
  }

  handleArrowKeyEvent(event) {
    event.preventDefault();
    this.setSelectedOptionIndex(this.state, event);
  }

  setSelectedOptionIndex = (
    { matchedOptions, selectedOptionIndex }: ISmartInputState,
    { keyCode }
  ) =>
    this.setState({
      selectedOptionIndex:
        (matchedOptions.length + selectedOptionIndex + (keyCode - 39)) %
        matchedOptions.length
    });

  matchAgainst = _.curry(
    (value: string, item: ISmartInputItem): boolean =>
      !!value && _.at(item, 'name', 'type').some(valuesMatch(value))
  );

  handleSubmit() {
    // TODO: reduce identifiers to a value; store event
    console.log('submit value');

    this.setState({
      inputValue: null,
      identifiers: [],
      matchedOptions: [],
      selectedOptionIndex: -1
    });
  }

  render() {
    const { initialWidth, rowHeight, inputStyle, style, ...props } = this.props;
    const { identifiers, inputValue, matchedOptions, selectedOptionIndex } = this.state;
    const borderRadius = rowHeight / 2;

    return (
      <StyledSmartInput rowHeight={rowHeight} style={{ position: 'relative', ...style }}>
        {!!matchedOptions.length && (
          <Flex
            // TODO: replace with react-virtualized-select (need labelKey)
            className="options pt-callout pt-elevation-2"
            align="stretch"
            column={true}
            style={{ top: identifiers.length * rowHeight }}
          >
            {[{ type: inputValue }]
              .concat(matchedOptions)
              .map((item: Partial<ISmartInputItem>, i) => (
                <div
                  className={`option row ${i && i - 1 === selectedOptionIndex
                    ? 'selected'
                    : ''}`}
                >
                  {item.name}
                </div>
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
const isEnterKeyEvent = (event): boolean => event.keyCode === 13;
const isUpArrowKeyEvent = (event): boolean => event.keyCode === 38;
const isDownArrowKeyEvent = (event): boolean => event.keyCode === 40;

const valuesMatch = _.curry(
  (val1: string = '', val2: string = ''): boolean =>
    !!val1 && val2.toLowerCase().includes(val1.toLowerCase())
);

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

      &.selected {
        background-color: #EBF1F5;
      }
    }
  }
`;
