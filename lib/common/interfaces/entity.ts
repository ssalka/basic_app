import { IEvent } from './events';
import { ID, IDocument } from './mongo';

export interface IEntity<T = any> {
  value: T;
}

export type EntityDocument<T = any> = IEntity<T> & IDocument;

export const enum EntityEventType {
  Created = 'ENTITY_CREATED',
  Requested = 'ENTITIES_REQUESTED'
}

export interface IIdentifier {
  name: string; // if resolved, should be value of document at name key
  references: {
    [domainModel: string]: ID | IDocument;
  };
}

export type CreateEntityEvent = IEvent<IEntity>;

export type EntityEvent = CreateEntityEvent;
