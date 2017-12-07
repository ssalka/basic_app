import { ModelGen } from 'lib/server/utils';
import Event from './Event';

export default ModelGen.extendModel(Event, {
  name: 'ValueEvent',
  statics: {
    async project(query = {}) {
      const events = await this.find(query).catch(console.error);

      return events.map(e => e.payload.value);
    }
  }
});
