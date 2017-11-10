import { ModelGen, types } from 'lib/server/utils';
import Event from './Event';
const { ObjectId, Mixed, ref } = types;

const ValueEventSchema = {
  metadata: {
    value: {
      name: {
        type: Mixed,
        required: true
      },
      references: {
        collection: ref('Collection'),
        document: ObjectId, // TODO: Document model (for user documents to extend)
        field: ObjectId // TODO: Field model (to hold type information, names, and values)
      }
    }
  }
};

export default ModelGen.extendModel(Event).as('ValueEvent', ValueEventSchema);
