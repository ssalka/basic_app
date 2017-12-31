import * as _ from 'lodash';
import * as React from 'react';
import { Flex } from 'grid-styled';
import { RouteComponentProps } from 'react-router';
import { EntityDocument, IAggregate, Field } from 'lib/common/interfaces';
import { BaseComponent, Button, TextInput, TagList } from 'lib/client/components';
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
      fields: []
    },
    entities: _.get(this.props.location.state, 'selectedEntities', [])
  };

  clearField = (index: number) => () => {
    this.setStateByPath(`aggregate.fields[${index}]`, undefined);
  };

  submitForm(event: React.FormEvent<any>) {
    // TODO
  }

  render() {
    const { aggregate, entities } = this.state;

    return (
      <Flex className="combine-entities" align="stretch">
        <div className="entities">
          <h5>Entities</h5>

          <TagList tags={_.map(entities, 'name')} />
        </div>

        <form onSubmit={this.submitForm}>
          {aggregate.fields.concat(emptyField).map((field, i) => (
            <Flex className="field" justify="space-around" key={i}>
              <div className="key">{field.key}</div>

              <div className="value">{field.value}</div>
            </Flex>
          ))}
        </form>
      </Flex>
    );
  }
}
