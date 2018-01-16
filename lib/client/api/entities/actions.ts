import {
  Action,
  CommandType,
  EntityDocument,
  IEntity,
  IPopulatedEntity,
  IEvent2,
  ID,
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

export const fetchEntitiesByUser = () => action(QueryType.FetchEntitiesByUser);

export interface IRenameEntityPayload {
  entity: EntityDocument;
  newName: string;
}

export const renameEntity = (entity: EntityDocument, newName: string): Action<IRenameEntityPayload> =>
  action(CommandType.RenameEntity, {
    entity,
    newName
  });

interface IFieldPayload {
  field: ID;
}

interface IFieldKeyPayload extends IFieldPayload {
  key: ID;
}

interface IFieldValuePayload extends IFieldPayload {
  value: ID;
}

// NB: Using 'update' keyword here - consider more descriptive alternatives
// TODO: integrate with fields array once moved to store from component
export const updateEntityField = (index: number, value: EntityDocument, type: CommandType): Action => (
  action(type, { index, value })
);

export const addField = (field: ID) => action(CommandType.AddField, { field });

export const addFieldKey = (field: ID, key: ID): Action<IFieldKeyPayload> => (
  action(CommandType.AddFieldKey, { field, key })
);

// NOTE: only supporting a generic update-like 'replace' (drag-drop)
// method for now, until inline typed entities are made available
export const replaceFieldKey = (field: ID, key: ID): Action<IFieldKeyPayload> => (
  action(CommandType.ReplaceFieldKey, { field, key })
);

export const removeFieldKey = (field: ID, key: ID): Action<IFieldKeyPayload> => (
  action(CommandType.RemoveFieldKey, { field, key })
);

export const addFieldValue = (field: ID, value: ID): Action<IFieldValuePayload> => (
  action(CommandType.AddFieldValue, { field, value })
);

export const replaceFieldValue = (field: ID, value: ID): Action<IFieldValuePayload> => (
  action(CommandType.ReplaceFieldValue, { field, value })
);

export const removeFieldValue = (field: ID, value: ID): Action<IFieldValuePayload> => (
  action(CommandType.RemoveFieldValue, { field, value })
);

export default {
  createEntity,
  fetchEntitiesByUser,
  renameEntity,
  updateEntityField,
  addField,
  addFieldKey,
  replaceFieldKey,
  removeFieldKey,
  addFieldValue,
  replaceFieldValue,
  removeFieldValue
};
