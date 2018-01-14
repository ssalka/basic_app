import * as classNames from 'classnames';
import produce from 'immer';
import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { DropTarget } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { EditableText } from '@blueprintjs/core';
import { createEntity } from 'lib/client/api/entities/actions';
import { BaseComponent, Button, TagList } from 'lib/client/components';
import { connect } from 'lib/client/services/utils';
import { MongoCollection } from 'lib/common/constants';
import { getName } from 'lib/common/helpers';
import {
  EntityDocument,
  IAggregate,
  IDocument,
  IEntity,
  IPopulatedEntity,
  Field
} from 'lib/common/interfaces';
import './styles.less';

interface ILocationState {
  selectedEntities: EntityDocument[];
}

interface IProps extends RouteComponentProps<any> {
  location: RouteComponentProps<any>['location'] & {
    state?: ILocationState;
  };
  createEntity: typeof createEntity;
}

interface IState {
  aggregate: IAggregate;
  entities: EntityDocument[];
}

const emptyField = new Field();

class CombineEntities extends BaseComponent<IProps, IState> {
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

      const aggregate = produce(this.state.aggregate, ({ fields }) => {
        if (isNewField) {
          fields.push(new Field());
        }

        fields[index][fieldKey] = _.isString(value)
          ? _.find(fields, { name: value })
          : value;
      });

      this.setState({ aggregate });
    }
  );

  handleUpdateAggregateName = this.handleUpdateField('value', 0);

  handleSubmit() {
    /**
     * TODO: check if resulting entity matches any existing ones
     *    - eg: existing entity "Cabinet" to refer to kitchen cabinets, but new aggregate is
     *      the executive/governmental type - should it be included? What about filing cabinets?
     */
    const { aggregate } = this.state;
    const [primaryField] = aggregate.fields;

    const entity: IPopulatedEntity<IAggregate> = {
      name: getName(primaryField.value),
      references: [
        {
          model: MongoCollection.Entity,
          value: aggregate
        }
      ]
    };

    // TODO: update existing entity if option selected
    this.props.createEntity(entity);
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
  (connector, monitor) => ({
    connectToDropTarget: connector.dropTarget(),
    isReady: monitor.isOver() && monitor.canDrop()
  })
)(({ className, connectToDropTarget, isReady, component = 'div', ...props }) =>
  connectToDropTarget(
    React.createElement(
      component,
      { className: classNames(className, isReady && 'ready-for-drop') },
      <EditableText placeholder="" {...props} />
    )
  )
);

export default connect({
  store: 'entity',
  actions: {
    createEntity
  }
})(CombineEntities);
