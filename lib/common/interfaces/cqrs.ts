import { IEntity, IPopulatedEntity } from './entity';
import { IUser } from './user';

export interface IEvent<P extends {} = {}> {
  type: string;
  payload?: P;
}

export interface IEvent2 {
  entity: string | IEntity | IPopulatedEntity;
  type: string;
  timestamp: Date;
  version: number;
  user?: string | IUser;
}

export const enum CommandType {
  CreateEntity = 'CREATE_ENTITY',
  RenameEntity = 'RENAME_ENTITY',
  AddFieldKey = 'ADD_FIELD_KEY',
  ReplaceFieldKey = 'REPLACE_FIELD_KEY',
  RemoveFieldKey = 'REMOVE_FIELD_KEY',
  AddFieldValue = 'ADD_FIELD_VALUE',
  ReplaceFieldValue = 'REPLACE_FIELD_VALUE',
  RemoveFieldValue = 'REMOVE_FIELD_VALUE'
}

export const enum QueryType {
  FetchEntitiesByUser = 'FETCH_ENTITIES_BY_USER'
}

export const enum EventType {
  // Entity Events
  EntityCreated = 'ENTITY_CREATED',
  EntityRenamed = 'ENTITY_RENAMED',
  EntitiesRequested = 'ENTITIES_REQUESTED',
  // Field Events
  FieldKeyAdded = 'FIELD_KEY_ADDED',
  FieldKeyReplaced = 'FIELD_KEY_REPLACED',
  FieldKeyRemoved = 'FIELD_KEY_REMOVED',
  FieldValueAdded = 'FIELD_VALUE_ADDED',
  FieldValueReplaced = 'FIELD_VALUE_REPLACED',
  FieldValueRemoved = 'FIELD_VALUE_REMOVED'
}
