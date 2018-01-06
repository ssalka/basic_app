import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { DropTarget } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { EditableText } from '@blueprintjs/core';
import { MongoCollection } from 'lib/common/constants';
import { getName } from 'lib/common/helpers';
import { EntityDocument, IAggregate, Field } from 'lib/common/interfaces';
import { BaseComponent, Button, TagList } from 'lib/client/components';
import './styles.less';

interface ILocationState {
  selectedEntities: EntityDocument[];
}

interface IProps extends RouteComponentProps<any> {
  location: RouteComponentProps<any>['location'] & {
    state?: ILocationState;
  };
}

interface IState {
  aggregate: IAggregate;
  entities: EntityDocument[];
}

const emptyField = new Field();

export default class CombineEntities extends BaseComponent<IProps, IState> {
  state: IState = {
    aggregate: {
      fields: [new Field({ key: 'name' })]
    },
    entities: _.get(this.props.location.state, 'selectedEntities', [])
  };

  handleUpdateField = _.curry(
    (fieldKey: 'key' | 'value', index: number, value: string | EntityDocument) => {
      const isNewField = index === this.state.aggregate.fields.length;

      if (isNewField && !value) return;

      const aggregate = _.cloneDeep(this.state.aggregate);

      const fieldValue: EntityDocument = _.isString(value)
        ? _.find(aggregate.fields, { name: value })
        : value;

      if (isNewField) {
        aggregate.fields.push(new Field({ [fieldKey]: fieldValue }));
      } else {
        aggregate.fields[index][fieldKey] = fieldValue;
      }

      this.setState({ aggregate });
    }
  );

  handleUpdateAggregateName = this.handleUpdateField('value', 0);

  handleSubmit() {
    /**
     * TODO: check if resulting entity matches any existing ones
     *  - IDEA: if a match is found, let the user decide whether the aggregate should
     *    just be added as a reference to the existing entity, or created as a
     *    reference to a new entity (the one created here)
     *    - eg: existing entity "Cabinet" to refer to kitchen cabinets, but new aggregate is
     *      the executive/governmental type - should it be included? What about filing cabinets?
     *  - IDEA: user should also have option to create a separate entity by the same name
     */
    const { aggregate } = this.state;
    const [primaryField] = aggregate.fields;

    const entity = {
      name: getName(primaryField.value),
      references: [
        {
          model: MongoCollection.Uncategorized, // TODO: set up collection in mongoose
          value: aggregate
        }
      ]
    };

    // TODO: create entity + aggregate
    console.log(entity);
  }

  render() {
    const { aggregate, entities } = this.state;
    const [primaryField, ...fields] = aggregate.fields;

    return (
      <div className="combine-entities">
        <div className="entities pt-elevation-4">
          <h5>Entities</h5>

          <TagList tags={entities} draggable={true} />
        </div>

        <div className="aggregate-title">
          <span className="aggregate-title-key">
            {_.capitalize(getName(primaryField.key))}
          </span>

          <EntityDropTarget
            value={getName(primaryField.value)}
            onConfirm={this.handleUpdateAggregateName}
            placeholder="New Aggregate Entity"
            component="h1"
          />
        </div>

        <div className="aggregate-fields">
          {fields.concat(emptyField).map((field, i) => (
            <Flex className="field" justify="space-around" key={i}>
              {/* TODO: add filterable entity selects as drop targets */}

              <EntityDropTarget
                className="key"
                value={getName(field.key)}
                onConfirm={this.handleUpdateField('key', i + 1)}
              />

              <EntityDropTarget
                className="value"
                value={getName(field.value)}
                onConfirm={this.handleUpdateField('value', i + 1)}
              />
            </Flex>
          ))}
        </div>

        <Button
          color="success"
          className="pt-large"
          disabled={!primaryField.value}
          onClick={this.handleSubmit}
        >
          Create {getName(primaryField.value) || 'Entity'}
        </Button>
      </div>
    );
  }
}

const entityDropTarget = {
  drop(props, monitor) {
    const item: EntityDocument = monitor.getItem();

    if (props.onConfirm) props.onConfirm(item);
  }
};

const EntityDropTarget = DropTarget(
  'DraggableTag',
  entityDropTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isReady: monitor.isOver() && monitor.canDrop()
  })
)(({ className, connectDropTarget, isReady, component = 'div', ...props }) =>
  connectDropTarget(
    React.createElement(
      component,
      { className: classNames(className, isReady && 'ready-for-drop') },
      <EditableText placeholder="" {...props} />
    )
  )
);
