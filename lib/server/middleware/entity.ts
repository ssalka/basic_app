import { RequestHandler } from 'express';
import { ObjectId } from 'mongoose/lib/types';
import { IEvent } from 'lib/common/interfaces/events';
import { IEntity, EntityEventType } from 'lib/common/interfaces/entity';
import { Entity, EntityEvent } from 'lib/server/models';

export const createEntity: RequestHandler = (req, res, next) => {
  const entity = new Entity(req.body);

  EntityEvent.create({
    type: EntityEventType.Created,
    creator: req.user._id,
    payload: {
      entity: entity.toObject()
    }
  })
    .then(entityEvent => res.json(entityEvent))
    .catch(next);
};

export const getEntities: RequestHandler = (req, res, next) => {
  EntityEvent.project({
    type: EntityEventType.Created,
    creator: req.user._id.toString()
  })
    .then(entities => res.json(entities))
    .catch(next);
};
