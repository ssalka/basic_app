import { RequestHandler } from 'express';
import * as _ from 'lodash';
import { ObjectId } from 'mongoose/lib/types';
import { IEvent } from 'lib/common/interfaces/events';
import { IEntity, EntityEventType } from 'lib/common/interfaces/entity';
import { Entity, EntityEvent } from 'lib/server/models';

export const createEntity: RequestHandler = (req, res, next) => {
  const entity = new Entity(req.body).toObject();

  const payload = {
    // prettier-ignore
    entity: _.isEmpty(req.body.references)
      ? entity
      : {
        ...entity,
        // TODO: see if this mapping can be avoided - currently seems necessary to get populated subdocuments
        references: req.body.references.map(({ model, value }) => ({
          model,
          value: new Entity(value).toObject()
        }))
      }
  };

  return EntityEvent.create({
    type: EntityEventType.Created,
    creator: req.user._id,
    payload
  })
    .then(entityEvent => res.json(entityEvent.payload.entity))
    .catch(next);
};

export const renameEntity: RequestHandler = (req, res, next) => {
  // TODO: add versioning to events, identify concurrent updates
  EntityEvent.create({
    type: EntityEventType.Renamed,
    creator: req.user._id,
    payload: {
      entityId: req.params.entityId,
      newName: req.body.newName
    }
  })
    .then(entityEvent => res.json(entityEvent))
    .catch(next);
};

export const getEntities: RequestHandler = (req, res, next) => {
  EntityEvent.project({ creator: req.user._id.toString() })
    .then(entities => res.json(entities))
    .catch(next);
};
