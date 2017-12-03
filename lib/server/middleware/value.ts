import { RequestHandler } from 'express';
import { ObjectId } from 'mongoose/lib/types';
import { ValueEventType } from 'lib/common/interfaces/value';
import { ValueEvent } from 'lib/server/models';

export const createValue: RequestHandler = (req, res, next) =>
  ValueEvent.create(
    {
      type: ValueEventType.CreateRequested,
      creator: req.user._id,
      payload: {
        // TODO: Snapshots
        //  - add stateful Value model, call create method with req.body
        value: {
          _id: new ObjectId().toString(),
          ...req.body.value
        }
      }
    },
    (err, value) => (err ? next(err) : res.json(value))
  );

export const getValues: RequestHandler = (req, res, next) =>
  ValueEvent.project({
    type: ValueEventType.CreateRequested,
    creator: req.user._id.toString()
  })
    .then(values => res.json(values))
    .catch(next);
