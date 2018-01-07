import {
  Action,
  EntityDocument,
  EntityEventType,
  ID,
  IEntity,
  IPopulatedEntity
} from 'lib/common/interfaces';

export interface ICreateEntityPayload {
  entity: IEntity | IPopulatedEntity;
}

export const createEntity = (
  entity: IEntity | IPopulatedEntity
): Action<ICreateEntityPayload> => ({
  type: EntityEventType.Created,
  entity
});

export const getEntities = (): Action => ({
  type: EntityEventType.Requested
});

export interface IUpdateEntityPayload {
  entityId: ID;
  updates: Partial<IEntity>;
}

export const updateEntity = (
  entityId: ID,
  updates: Partial<IEntity>
): Action<IUpdateEntityPayload> => ({
  type: EntityEventType.Updated,
  entityId,
  updates
});

export default {
  createEntity,
  getEntities,
  updateEntity
};
