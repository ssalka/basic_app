import * as _ from 'lodash';
import { EntityEventType } from 'lib/common/interfaces/entity';
import { ModelGen } from 'lib/server/utils';
import Event from './Event';

export default ModelGen.extendModel(Event, {
  name: 'EntityEvent',
  statics: {
    async project(query = {}) {
      const events = await this.find(query).catch(console.error);

      return events.reduce((entities, { type, payload }) => {
        switch (type) {
          case EntityEventType.Created: {
            entities.push(payload.entity);

            return entities;
          }

          case EntityEventType.Renamed: {
            // REVIEW: better way to find by ObjectId?
            const matchedEntity = entities.find(
              ({ _id }) => payload.entityId === _id.toString()
            );

            if (matchedEntity) {
              matchedEntity.name = payload.newName;
            } else {
              console.error('Unable to find entity to update. Received payload', payload);
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
  }
});
