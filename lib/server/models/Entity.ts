import { Schema } from 'mongoose';
import { MongoCollection } from 'lib/common/constants';
import { ModelGen, types } from '../utils';
const { dynamicRef, Mixed } = types;

export const EntitySchema = {
  _id: {
    type: String,
    required: true
  },
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
  references: {
    type: [
      {
        model: {
          type: String,
          required: true,
          default: MongoCollection.Entity
        },
        value: dynamicRef('references.model')
      }
    ],
    default: []
  }
};

export default ModelGen.generateModel(MongoCollection.Entity, EntitySchema);
