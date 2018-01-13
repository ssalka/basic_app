import { RequestHandler } from 'express';
import * as _ from 'lodash';
import { ObjectId } from 'mongoose/lib/types';
import { IEvent } from 'lib/common/interfaces/events';
import { IEntity, EventType } from 'lib/common/interfaces/entity';
import { Entity, Event, EntityCreated } from 'lib/server/models';

export const createEntity: RequestHandler = (req, res, next) => {
  const { entity, timestamp, version } = req.body;
  const validatedEntity = new Entity(entity).toObject();

  if (!_.isEmpty(entity.references)) {
    validatedEntity.references = entity.references.map(({ model, value }) => ({
      model,
      value: new Entity(value).toObject()
    }));
  }

  return EntityCreated.create({
    user: req.user._id,
    entity: validatedEntity._id,
    newEntity: validatedEntity,
    timestamp,
    version
  })
    .then(entityEvent => res.json(entityEvent.newEntity))
    .catch(next);
};

export const renameEntity: RequestHandler = (req, res, next) => {
  // TODO: add versioning to events, identify concurrent updates
  Event.create({
    type: EventType.EntityRenamed,
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
  Event.project({ user: req.user._id.toString() })
    .then(entities => res.json(entities))
    .catch(next);
};
