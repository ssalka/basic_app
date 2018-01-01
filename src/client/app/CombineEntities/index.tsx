import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
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
      this.setStateByPath(`fields[${index}].${fieldKey}`, newValue);
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

          <TagList tags={_.map(entities, 'name')} />
        </div>

        <div className="aggregate-title">
          <span className="aggregate-title-key">{_.capitalize(primaryField.key)}</span>
          <h1>
            <EditableText
              defaultValue={primaryField.value}
              onConfirm={this.handleUpdateAggregateName}
              placeholder="New Aggregate Entity"
            />
          </h1>
        </div>

        <div className="aggregate-fields">
          {fields.concat(emptyField).map((field, i) => (
            <Flex className="field" justify="space-around" key={i}>
              {/* TODO: add filterable entity selects as drop targets */}

              <div className="key">
                <EditableText
                  defaultValue={field.key}
                  onConfirm={this.handleUpdateField('key', i + 1)}
                  placeholder=""
                />
              </div>

              <div className="value">
                <EditableText
                  defaultValue={field.value}
                  onConfirm={this.handleUpdateField('value', i + 1)}
                  placeholder=""
                />
              </div>
            </Flex>
          ))}
        </div>
      </div>
    );
  }
}
