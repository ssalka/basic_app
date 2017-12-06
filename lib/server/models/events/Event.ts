import { ModelGen, types } from 'lib/server/utils';
const { Mixed, ref } = types;

const EventSchema = {
  creator: ref('User', true),
  type: {
    type: String,
    required: true
  },
  payload: {
    type: Mixed,
    required: true,
    default: {}
  }
};

export default ModelGen.generateModel('Event', EventSchema);
