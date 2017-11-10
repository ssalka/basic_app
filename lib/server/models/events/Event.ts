import { ModelGen } from 'lib/server/utils';

const EventSchema = {
  type: {
    type: String,
    required: true
  },
  metadata: {
    /* Implemented by submodels */
  }
};

export default ModelGen.generateModel('Event', EventSchema);
