import * as classNames from 'classnames';
import * as _ from 'lodash';
import { Flex } from 'grid-styled';
import * as React from 'react';
import { EditableText, NonIdealState } from '@blueprintjs/core';
import { getEntities, updateEntity } from 'lib/client/api/entities/actions';
import { BaseComponent, Button } from 'lib/client/components';
import { connect } from 'lib/client/services/utils';
import { EntityDocument } from 'lib/common/interfaces';
import 'lib/client/styles/EntityList.less';

interface IEntityListProps {
  entities: EntityDocument[];
  // REVIEW: is this the best way to represent action creators? could also do `typeof entityActions`
  getEntities: typeof getEntities;
  updateEntity: typeof updateEntity;
}

interface IEntityListState {
  combineEntities: boolean;
  selectedEntities: EntityDocument[];
}

class EntityList extends BaseComponent<
  IEntityListProps & React.HTMLProps<HTMLDivElement>,
  IEntityListState
> {
  state: IEntityListState = {
    combineEntities: false,
    selectedEntities: []
  };

  componentDidMount() {
    if (_.isEmpty(this.props.entities)) {
      this.props.getEntities();
    }
  }

  getUpdateHandler(entity: EntityDocument) {
    return (name: string) => this.props.updateEntity(entity._id, { name });
  }

  toggleCombineEntities = () => this._toggle('combineEntities');

  getToggleSelectedHandler = (entity: EntityDocument) => () => {
    const { selectedEntities } = this.state;

    return this.setState({
      selectedEntities: _.find(selectedEntities, entity)
        ? _.reject(selectedEntities, entity)
        : selectedEntities.concat(entity)
    });
  };

  render() {
    const { entities, style } = this.props;
    const { combineEntities, selectedEntities } = this.state;

    return entities.length ? (
      <Flex column={true} className="entity-list pt-callout pt-elevation-1" style={style}>
        <h4 className="view-title">
          Entities <span className="muted">({entities.length})</span>
        </h4>

        <Button
          icon="group-objects"
          minimal={true}
          rounded={true}
          onClick={this.toggleCombineEntities}
        />

        <div className={classNames('drawer', combineEntities && 'open')}>
          <h6>Combine Entities</h6>
        </div>

        <div
          className={classNames(
            'entity-list-items',
            'scroll-y',
            combineEntities && 'with-icons'
          )}
        >
          {entities.map((entity: EntityDocument, i) => (
            <React.Fragment key={i}>
              {combineEntities && (
                <Button
                  className={classNames(
                    'select-entity-checkbox',
                    combineEntities && 'visible'
                  )}
                  icon={_.find(selectedEntities, entity) ? 'tick' : 'plus'}
                  color={_.find(selectedEntities, entity) && 'success'}
                  minimal={true}
                  rounded={true}
                  size="small"
                  onClick={this.getToggleSelectedHandler(entity)}
                />
              )}

              <EditableText
                defaultValue={entity.name}
                onConfirm={this.getUpdateHandler(entity)}
                placeholder="New Entity"
              />
            </React.Fragment>
          ))}
        </div>
      </Flex>
    ) : (
      <NonIdealState
        visual="manually-entered-data"
        title="You haven't added any Entities"
        description={
          <span>
            Think of an Entity as an ordinary object containing a value. Use it to
            represent any piece of data.
          </span>
        }
      />
    );
  }
}

export default connect({
  store: 'entity',
  actions: {
    getEntities,
    updateEntity
  }
})(EntityList);
