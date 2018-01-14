import { EventType } from 'lib/common/interfaces';
import { ModelGen } from 'lib/server/utils';
import { Event } from '../';
import Entity from '../Entity';

export default ModelGen.extendModel(Event, {
  name: EventType.EntityCreated,
  schema: {
    newEntity: Entity.schema
  }
});
