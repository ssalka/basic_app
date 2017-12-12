import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { EditableText, NonIdealState } from '@blueprintjs/core';
import { getEntities } from 'lib/client/api/entities/actions';
import { PopulatedEntityDocument } from 'lib/common/interfaces';

interface IEntityListProps {
  entities: PopulatedEntityDocument[];
  getEntities(): void;
  updateEntity(index): void;
}

class EntityList extends React.Component<
  IEntityListProps & React.HTMLProps<HTMLDivElement>
> {
  componentDidMount() {
    if (_.isEmpty(this.props.entities)) {
      this.props.getEntities();
    }
  }

  getUpdateHandler(entity: PopulatedEntityDocument) {
    return () => this.props.updateEntity(entity);
  }

  render() {
    const { entities, updateEntity, style } = this.props;

    return entities.length ? (
      <div className="entity-list pt-callout pt-elevation-1" style={style}>
        <h4 className="view-title">
          Entities <span className="muted">({entities.length})</span>
        </h4>

        <div className="scroll-y">
          {entities.map((entity: PopulatedEntityDocument) => (
            <EditableText
              key={entity._id}
              value={entity.name}
              onChange={this.getUpdateHandler(entity)}
              placeholder="New Entity"
            />
          ))}
        </div>
      </div>
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

export default connect(
  state => state.entity,
  dispatch => ({
    getEntities: () => dispatch(getEntities()),
    updateEntity: _.noop // TODO
  })
)(EntityList);
