import { ModelGen, types } from 'lib/server/utils';
const { ref } = types;

const EventSchema = {
  entity: ref('Entity', true),
  user: ref('User'),
  // TODO: command ref (need to store commands separately first)
  type: {
    // TODO: use mongoose discriminators to create subclasses instead
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  version: {
    type: Number,
    required: true
  }
};

export default ModelGen.generateModel('Event', EventSchema);
