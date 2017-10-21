import { ModelGen } from 'lib/server/utils';

const EventSchema = {
  eventType: {
    type: String,
    required: true
  },
  payload: Object
};

export default ModelGen.generateModel('Event', EventSchema);
