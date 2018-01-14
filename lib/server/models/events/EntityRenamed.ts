import { EventType } from 'lib/common/interfaces';
import { ModelGen } from 'lib/server/utils';
import { Event } from '../';

export default ModelGen.extendModel(Event, {
  name: EventType.EntityRenamed,
  schema: {
    newName: {
      type: String,
      required: true
    }
  }
});
