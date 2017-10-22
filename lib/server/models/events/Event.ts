import { ModelGen } from 'lib/server/utils';

const EventSchema = {
  eventType: {
    type: String,
    required: true
  },
  metadata: {
    /* Implemented by submodels */
  }
};

export default ModelGen.generateModel('Event', EventSchema);
