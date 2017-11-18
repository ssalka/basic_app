import { ObjectId } from 'mongoose/lib/types';
import { ValueCommand } from 'lib/common/interfaces/events';
import { ValueEvent } from 'lib/server/models';

export function createValue(req, res, next) {
  ValueEvent.create(
    {
      type: ValueCommand.Create,
      creator: req.user._id,
      metadata: {
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
