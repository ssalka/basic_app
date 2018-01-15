import {
  Action,
  CommandType,
  EntityDocument,
  IEntity,
  IPopulatedEntity,
  IEvent2,
  QueryType
} from 'lib/common/interfaces';
import { action } from 'lib/client/services/utils';

export interface ICreateEntityPayload extends Pick<IEvent2, 'entity' | 'timestamp' | 'version'> {
  entity: IEntity | IPopulatedEntity;
}

export const createEntity = (entity: IEntity | IPopulatedEntity): Action<ICreateEntityPayload> =>
  action(CommandType.CreateEntity, {
    entity,
    timestamp: new Date(),
    version: 0
  });

export const fetchEntitiesByUser = (): Action => action(QueryType.FetchEntitiesByUser);

export interface IRenameEntityPayload {
  entity: EntityDocument;
  newName: string;
}

export const renameEntity = (entity: EntityDocument, newName: string): Action<IRenameEntityPayload> =>
  action(CommandType.RenameEntity, {
    entity,
    newName
  });

// NB: Using 'update' keyword here - consider more descriptive alternatives
// TODO: integrate with fields array once moved to store from component
export const updateEntityField = (index: number, value: EntityDocument, type: CommandType): Action => action(type, { index, value });

export default {
  createEntity,
  fetchEntitiesByUser,
  renameEntity,
  updateEntityField
};
