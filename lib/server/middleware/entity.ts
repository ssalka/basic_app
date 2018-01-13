import { RequestHandler } from 'express';
import * as _ from 'lodash';
import { ObjectId } from 'mongoose/lib/types';
import * as uuid from 'uuid/v4';
import { IEvent, EventType } from 'lib/common/interfaces/events';
import { IEntity } from 'lib/common/interfaces/entity';
import { Entity, Event, EntityCreated, EntityRenamed } from 'lib/server/models';

export const createEntity: RequestHandler = (req, res, next) => {
  const { entity, timestamp, version } = req.body;
  const validatedEntity = new Entity({ ...entity, _id: uuid() }).toObject();

  if (!_.isEmpty(entity.references)) {
    validatedEntity.references = entity.references.map(({ model, value }) => ({
      model,
      value: new Entity({ ...value, _id: uuid() }).toObject()
    }));
  }

  return EntityCreated.create({
    user: req.user._id,
    entity: validatedEntity,
    newEntity: validatedEntity,
    timestamp,
    version
  })
    .then(entityEvent => res.json(entityEvent.newEntity))
    .catch(next);
};

export const renameEntity: RequestHandler = (req, res, next) => {
  const { newName, timestamp, version } = req.body;

  // TODO: identify concurrent updates
  EntityRenamed.create({
    user: req.user._id,
    entity: req.params.entityId,
    newName,
    timestamp,
    version
  })
    .then(entityEvent => res.json(entityEvent))
    .catch(next);
};

export const getEntities: RequestHandler = (req, res, next) => {
  Event.project({ user: req.user._id.toString() })
    .then(entities => res.json(entities))
    .catch(next);
};
