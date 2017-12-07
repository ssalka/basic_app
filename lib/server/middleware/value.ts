import { RequestHandler } from 'express';
import { ObjectId } from 'mongoose/lib/types';
import { IEvent } from 'lib/common/interfaces/events';
import { IValue, ValueEventType } from 'lib/common/interfaces/value';
import { Value, ValueEvent } from 'lib/server/models';

export const createValue: RequestHandler = (req, res, next) => {
  const value = new Value(req.body.value);

  ValueEvent.create({
    type: ValueEventType.Created,
    creator: req.user._id,
    payload: {
      value: value.toObject()
    }
  })
    .then(value => res.json(value))
    .catch(next);
};

export const getValues: RequestHandler = (req, res, next) => {
  ValueEvent.project({
    type: ValueEventType.Created,
    creator: req.user._id.toString()
  })
    .then(values => res.json(values))
    .catch(next);
};
