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
  AddField = 'ADD_ENTITY_FIELD',
  RemoveField = 'REMOVE_ENTITY_FIELD',
  AddFieldKey = 'ADD_ENTITY_FIELD_KEY',
  ReplaceFieldKey = 'REPLACE_ENTITY_FIELD_KEY',
  RemoveFieldKey = 'REMOVE_ENTITY_FIELD_KEY',
  AddFieldValue = 'ADD_ENTITY_FIELD_VALUE',
  ReplaceFieldValue = 'REPLACE_ENTITY_FIELD_VALUE',
  RemoveFieldValue = 'REMOVE_ENTITY_FIELD_VALUE'
}

export const enum QueryType {
  FetchEntitiesByUser = 'FETCH_ENTITIES_BY_USER'
}

export const enum EventType {
  EntityCreated = 'ENTITY_CREATED',
  EntityRenamed = 'ENTITY_RENAMED',
  EntitiesRequested = 'ENTITIES_REQUESTED',
  FieldAdded = 'ENTITY_FIELD_ADDED',
  FieldRemoved = 'ENTITY_FIELD_REMOVED',
  FieldKeyAdded = 'ENTITY_FIELD_KEY_ADDED',
  FieldKeyReplaced = 'ENTITY_FIELD_KEY_REPLACED',
  FieldKeyRemoved = 'ENTITY_FIELD_KEY_REMOVED',
  FieldValueAdded = 'ENTITY_FIELD_VALUE_ADDED',
  FieldValueReplaced = 'ENTITY_FIELD_VALUE_REPLACED',
  FieldValueRemoved = 'ENTITY_FIELD_VALUE_REMOVED'
}
