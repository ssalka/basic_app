import {
  Action,
  EntityDocument,
  EventType,
  ID,
  IEntity,
  IPopulatedEntity,
  IEvent2
} from 'lib/common/interfaces';

export interface ICreateEntityPayload
  extends Pick<IEvent2, 'entity' | 'timestamp' | 'version'> {
  entity: IEntity | IPopulatedEntity;
}

export const createEntity = (
  entity: IEntity | IPopulatedEntity
): Action<ICreateEntityPayload> => ({
  type: EventType.EntityCreated,
  entity,
  timestamp: new Date(),
  version: 0
});

export const getEntities = (): Action => ({
  type: EventType.EntitiesRequested
});

export interface IRenameEntityPayload {
  entity: EntityDocument;
  newName: string;
}

export const renameEntity = (
  entity: EntityDocument,
  newName: string
): Action<IRenameEntityPayload> => ({
  type: EventType.EntityRenamed,
  entity,
  newName
});

export default {
  createEntity,
  getEntities,
  renameEntity
};
