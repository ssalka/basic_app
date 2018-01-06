import { MongoCollection } from 'lib/common/constants';
import { ModelGen, types } from '../utils';
const { dynamicRef, Mixed } = types;

export default ModelGen.generateModel(MongoCollection.Entity, {
  name: String,
  fields: {
    type: [
      {
        // TODO: Field Model
        key: Mixed,
        value: Mixed
      }
    ],
    default: []
  },
  references: [
    {
      model: {
        type: String,
        required: true,
        default: MongoCollection.Entity
      },
      value: dynamicRef('references.model')
    }
  ]
});
