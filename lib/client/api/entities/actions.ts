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

export interface IRenameEntityPayload {
  entityId: ID;
  updates: Partial<IEntity>;
}

export const renameEntity = (
  entityId: ID,
  updates: Partial<IEntity>
): Action<IRenameEntityPayload> => ({
  type: EntityEventType.Renamed,
  entityId,
  updates
});

export default {
  createEntity,
  getEntities,
  renameEntity
};
