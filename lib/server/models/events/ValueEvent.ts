import { IValue, ValueEvent } from 'lib/common/interfaces';
import { ModelGen, types } from 'lib/server/utils';
import Event from './Event';
const { Mixed, ref } = types;

const ValueEventSchema = {
  payload: {
    type: Mixed,
    required: true
  }
};

export default ModelGen.extendModel(Event).as('ValueEvent', ValueEventSchema);
