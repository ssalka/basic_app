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
  newName: string;
}

export const renameEntity = (
  entityId: ID,
  newName: string
): Action<IRenameEntityPayload> => ({
  type: EntityEventType.Renamed,
  entityId,
  newName
});

export default {
  createEntity,
  getEntities,
  renameEntity
};
