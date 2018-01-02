import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { DropTarget } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { EditableText } from '@blueprintjs/core';
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
    (fieldKey: 'key' | 'value', index: number, newValue: string) => {
      const isNewField = index === this.state.aggregate.fields.length;
      if (isNewField && !newValue) return;

      const aggregate = _.cloneDeep(this.state.aggregate);

      if (isNewField) aggregate.fields.push({ [fieldKey]: newValue });
      else _.set(aggregate.fields[index], fieldKey, newValue);

      this.setState({ aggregate });
    }
  );

  handleUpdateAggregateName = this.handleUpdateField('value', 0);

  render() {
    const { aggregate, entities } = this.state;
    const [primaryField, ...fields] = aggregate.fields;

    return (
      <div className="combine-entities">
        <div className="entities pt-elevation-4">
          <h5>Entities</h5>

          <TagList tags={_.map(entities, 'name')} draggable={true} />
        </div>

        <div className="aggregate-title">
          <span className="aggregate-title-key">{_.capitalize(primaryField.key)}</span>
          <EntityDropTarget
            value={primaryField.value}
            onConfirm={this.handleUpdateAggregateName}
            placeholder="New Aggregate Entity"
            component="h1"
          />
        </div>

        <div className="aggregate-fields">
          {fields.concat(emptyField).map((field, i) => (
            <Flex className="field" justify="space-around" key={i}>
              {/* TODO: support typing entity names - create new or update existing? */}
              {/* TODO: add filterable entity selects as drop targets */}

              <EntityDropTarget
                className="key"
                value={field.key}
                onConfirm={this.handleUpdateField('key', i + 1)}
              />

              <EntityDropTarget
                className="value"
                value={field.value}
                onConfirm={this.handleUpdateField('value', i + 1)}
              />
            </Flex>
          ))}
        </div>
      </div>
    );
  }
}

const entityDropTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    if (props.onConfirm) props.onConfirm(item.name);
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
