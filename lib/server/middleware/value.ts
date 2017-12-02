import { ObjectId } from 'mongoose/lib/types';
import { ValueEventType } from 'lib/common/interfaces/value';
import { ValueEvent } from 'lib/server/models';

export function createValue(req, res, next) {
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
}
