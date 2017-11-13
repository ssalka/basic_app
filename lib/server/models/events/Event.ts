import { ModelGen, types } from 'lib/server/utils';
const { ref } = types;

const EventSchema = {
  creator: ref('User', true),
  type: {
    type: String,
    required: true
  },
  metadata: {
    /* Implemented by submodels */
  }
};

export default ModelGen.generateModel('Event', EventSchema);
