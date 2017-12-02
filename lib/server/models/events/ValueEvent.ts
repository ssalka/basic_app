import { IValue, ValueEvent, ValueEventType } from 'lib/common/interfaces';
import { ModelGen, types } from 'lib/server/utils';
import Event from './Event';
const { Mixed, ref } = types;

const ValueEventSchema = {
  payload: {
    type: Mixed,
    required: true
  }
};

const statics = {
  async project(query) {
    const events = await this.find(query).catch(console.error);

    return events.map(e => e.payload.value);
  }
};

export default ModelGen.extendModel(Event, {
  name: 'ValueEvent',
  schema: ValueEventSchema,
  statics
});
