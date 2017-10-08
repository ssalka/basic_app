import { Schema } from 'mongoose';

export const { Mixed, ObjectId } = Schema.Types;

export const ref = (collection, required = false) => ({
  type: Schema.Types.ObjectId,
  ref: collection,
  required
});