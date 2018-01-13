import { MongoCollection } from 'lib/common/constants';
import { EventType } from 'lib/common/interfaces';
import { ModelGen } from 'lib/server/utils';
import { Entity, Event } from '../';

export default ModelGen.extendModel(Event, {
  name: EventType.EntityCreated,
  schema: {
    newEntity: Entity.schema
  }
});
