import { ModelGen } from 'lib/server/utils';
import Event from './Event';

const ValueEventSchema = {
  value: {
    type: Object,
    required: true
  }
};

export default ModelGen.extendModel(Event).as('ValueEvent', ValueEventSchema);
