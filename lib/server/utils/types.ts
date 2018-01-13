import { Schema } from 'mongoose';

export const Mixed = {};

export const ref = (collection, required = false) => ({
  type: Schema.Types.ObjectId,
  ref: collection,
  required
});

export const dynamicRef = (collection, required = false) => ({
  type: String,
  refPath: collection,
  required
});
