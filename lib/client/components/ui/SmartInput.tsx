import * as _ from 'lodash';
import * as React from 'react';
import { ActionCreator } from 'redux';
import { Flex } from 'grid-styled';
import { EditableText } from '@blueprintjs/core';
import styled from 'styled-components';
import { ViewComponent } from 'lib/client/components';
import { Collection, IDocument, IEntity, IPopulatedEntity } from 'lib/common/interfaces';
import { IEntityAction } from 'lib/client/api/entities/actions';

interface ISmartInputProps extends React.HTMLProps<HTMLDivElement> {
  initialWidth?: number;
  rowHeight?: number;
  collections: Collection[];
  inputStyle?: React.CSSProperties;
  actions: Record<string, ActionCreator<IEntityAction>>;
}

interface ISmartInputState {
  inputValue: string;
  selectedEntities: (IEntity | IPopulatedEntity)[];
  entities: IPopulatedEntity[];
  matchedEntities: IPopulatedEntity[];
  focusedEntityIndex: number;
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
    inputValue: '',
    selectedEntities: [],
    // TODO: create entities for each collection, use instead of actual collections; include documents
    entities: this.props.collections.map((collection: Collection): IPopulatedEntity => ({
      name: collection.name,
      references: [
        {
          type: 'Collection',
          value: collection as IDocument<'Collection'>
        }
      ]
    })),
    matchedEntities: [],
    focusedEntityIndex: -1
  };

  handleChange({ target: { value } }) {
    this.setState({
      inputValue: value,
      matchedEntities: value ? this.state.entities.filter(this.matchAgainst(value)) : []
    });
  }

  getNewEntity(event): IEntity | IPopulatedEntity {
    if (this.state.focusedEntityIndex >= 0) {
      return this.state.matchedEntities[this.state.focusedEntityIndex];
    } else if (this.state.matchedEntities.length === 1) {
      return this.state.matchedEntities[0];
    } else {
      return {
        name: event.target.value,
        references: []
      };
    }
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
      if (this.state.inputValue) {
        this.handleTabKeyEvent(event, this.handleSubmit);
      } else {
        this.handleSubmit();
      }
    }
  }

  handleTabKeyEvent(event, cb = _.noop) {
    if (!this.state.inputValue) return;

    const newEntity = this.getNewEntity(event);

    this.setState(
      {
        inputValue: '',
        matchedEntities: [],
        selectedEntities: this.state.selectedEntities.concat(newEntity),
        focusedEntityIndex: -1
      },
      cb
    );
  }

  handleArrowKeyEvent(event) {
    event.preventDefault();
    this.setFocusedEntityIndex(this.state, event);
  }

  setFocusedEntityIndex = (
    { matchedEntities, focusedEntityIndex }: ISmartInputState,
    { keyCode }
  ) =>
    this.setState({
      focusedEntityIndex:
        (matchedEntities.length + focusedEntityIndex + (keyCode - 39)) %
        matchedEntities.length
    });

  matchAgainst = _.curry(
    (value: string, entity: IPopulatedEntity): boolean =>
      !!value &&
      _(entity.references)
        .map('name')
        .concat(entity.name)
        .some(entitiesMatch(value))
  );

  handleSubmit() {
    // TODO: put more constraints on which combinations of entities are valid
    // (this will have mostly to do with how the selection, filtering of matchedEntities occurs,
    // eg switching from collections to documents if a collection entity is added)

    const [firstEntity, ...otherEntities] = this.state.selectedEntities;

    if (!firstEntity) {
      return; // TODO: show a tooltip describing how to use SmartInput
    }

    if (otherEntities.length) {
      // TODO: create entity in accordance with references of other entities
    } else if (_.isEmpty(firstEntity.references)) {
      this.props.actions.createEntity(firstEntity);
    } else {
      return; // TODO: select a reference to navigate to
    }

    this.setState({
      inputValue: '',
      selectedEntities: [],
      matchedEntities: [],
      focusedEntityIndex: -1
    });
  }

  render() {
    const { initialWidth, rowHeight, inputStyle, style, ...props } = this.props;
    const {
      selectedEntities,
      inputValue,
      matchedEntities,
      focusedEntityIndex
    } = this.state;
    const borderRadius = rowHeight / 2;

    return (
      <StyledSmartInput rowHeight={rowHeight} style={{ position: 'relative', ...style }}>
        {!!matchedEntities.length && (
          <Flex
            // TODO: replace with react-virtualized-select (need labelKey)
            className="entities pt-callout pt-elevation-2"
            align="stretch"
            column={true}
            style={{ top: selectedEntities.length * rowHeight }}
          >
            {[{ name: inputValue }]
              .concat(matchedEntities)
              .map((entity: Partial<IEntity>, i) => (
                <div
                  key={i}
                  className={`option row ${i && i - 1 === focusedEntityIndex
                    ? 'selected'
                    : ''}`}
                >
                  {entity.name}
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
          {selectedEntities.map(({ name, references }, i) => (
            <Flex
              className="identifier row"
              align="center"
              justify="flex-start"
              px={10}
              key={i}
            >
              <span className="pt-tag" style={{ marginRight: 5 }}>
                {_.isEmpty(references) ? 'Entity' : _.capitalize(references[0].type)}
              </span>

              <span>{name}</span>
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
              borderRadius: selectedEntities.length
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

const entitiesMatch = _.curry(
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

  .entities {
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
