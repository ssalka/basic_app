import { MongoCollection } from 'lib/common/constants';
import { ModelGen, types } from '../utils';
const { dynamicRef } = types;

export default ModelGen.generateModel(MongoCollection.Entity, {
  name: String,
  fields: {
    type: [
      {
        // TODO: Field Model
        key: String,
        value: String
      }
    ],
    default: []
  },
  references: [
    {
      model: {
        type: String,
        required: true,
        default: MongoCollection.Uncategorized
      },
      value: dynamicRef('references.model')
    }
  ]
});
