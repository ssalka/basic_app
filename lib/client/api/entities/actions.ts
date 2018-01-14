import {
  Action,
  CommandType,
  EntityDocument,
  IEntity,
  IPopulatedEntity,
  IEvent2,
  QueryType
} from 'lib/common/interfaces';

export interface ICreateEntityPayload
  extends Pick<IEvent2, 'entity' | 'timestamp' | 'version'> {
  entity: IEntity | IPopulatedEntity;
}

export const createEntity = (
  entity: IEntity | IPopulatedEntity
): Action<ICreateEntityPayload> => ({
  type: CommandType.CreateEntity,
  entity,
  timestamp: new Date(),
  version: 0
});

export const fetchEntitiesByUser = (): Action => ({
  type: QueryType.FetchEntitiesByUser
});

export interface IRenameEntityPayload {
  entity: EntityDocument;
  newName: string;
}

export const renameEntity = (
  entity: EntityDocument,
  newName: string
): Action<IRenameEntityPayload> => ({
  type: CommandType.RenameEntity,
  entity,
  newName
});

export default {
  createEntity,
  fetchEntitiesByUser,
  renameEntity
};
