import * as _ from 'lodash';
import { Flex } from 'grid-styled';
import * as React from 'react';
import { EditableText, NonIdealState } from '@blueprintjs/core';
import { getEntities, updateEntity } from 'lib/client/api/entities/actions';
import { connect } from 'lib/client/services/utils';
import { EntityDocument } from 'lib/common/interfaces';

interface IEntityListProps {
  entities: EntityDocument[];
  // REVIEW: is this the best way to represent action creators? could also do `typeof entityActions`
  getEntities: typeof getEntities;
  updateEntity: typeof updateEntity;
}

class EntityList extends React.Component<
  IEntityListProps & React.HTMLProps<HTMLDivElement>
> {
  componentDidMount() {
    if (_.isEmpty(this.props.entities)) {
      this.props.getEntities();
    }
  }

  getUpdateHandler(entity: EntityDocument) {
    return (name: string) => this.props.updateEntity(entity._id, { name });
  }

  render() {
    const { entities, style } = this.props;

    return entities.length ? (
      <Flex column={true} className="entity-list pt-callout pt-elevation-1" style={style}>
        <h4 className="view-title">
          Entities <span className="muted">({entities.length})</span>
        </h4>

        <div className="scroll-y" style={{ flexGrow: 1 }}>
          {entities.map((entity: EntityDocument, i) => (
            <EditableText
              key={i}
              defaultValue={entity.name}
              onConfirm={this.getUpdateHandler(entity)}
              placeholder="New Entity"
            />
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