import { ID, IDocument, Versioned } from './mongo';

export interface IReference {
  model: string;
  value: ID;
}

export interface IPopulatedReference<T> {
  model: string;
  value: T;
}

export interface IEntity {
  name: string;
  references: IReference[];
}

export interface IPopulatedEntity<T = {}> {
  name: string;
  references: IPopulatedReference<T>[];
}

export type EntityDocument = Versioned<IEntity & IDocument<'Entity'>>;

export type PopulatedEntityDocument<T = {}> = IPopulatedEntity<T> & IDocument<'Entity'>;

export const enum EventType {
  EntityCreated = 'ENTITY_CREATED',
  EntityRenamed = 'ENTITY_RENAMED',
  EntitiesRequested = 'ENTITIES_REQUESTED'
}
