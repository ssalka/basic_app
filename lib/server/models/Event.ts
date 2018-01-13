import * as _ from 'lodash';
import { EventType } from 'lib/common/interfaces/entity';
import { ModelGen, types } from 'lib/server/utils';
const { ref } = types;

const EventSchema = {
  entity: ref('Entity', true),
  user: ref('User'),
  // TODO: command ref (need to store commands separately first)
  timestamp: {
    type: Date,
    required: true
  },
  version: {
    type: Number,
    required: true
  }
};

const statics = {
  async project(query = {}) {
    const events = await this.find(query).catch(console.error);

    return events.reduce((entities, { type, entity, entityId, newName, newEntity }) => {
      switch (type) {
        case EventType.EntityCreated: {
          entities.push(newEntity);

          return entities;
        }

        case EventType.EntityRenamed: {
          // REVIEW: better way to find by ObjectId?
          const matchedEntity = entities.find(({ _id }) => entityId === _id.toString());

          if (matchedEntity) {
            matchedEntity.name = newName;
          } else {
            console.error('Found no entities with _id', entityId);
          }

          return entities;
        }

        default: {
          console.warn('Unrecognized event type', type);

          return entities;
        }
      }
    }, []);
  }
};

export default ModelGen.generateModel('Event', EventSchema, {
  props: { statics },
  options: {
    discriminatorKey: 'type'
  }
});
