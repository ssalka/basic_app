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
  RenameEntity = 'RENAME_ENTITY'
}

export const enum QueryType {
  FetchEntitiesByUser = 'FETCH_ENTITIES_BY_USER'
}

export const enum EventType {
  EntityCreated = 'ENTITY_CREATED',
  EntityRenamed = 'ENTITY_RENAMED',
  EntitiesRequested = 'ENTITIES_REQUESTED'
}
