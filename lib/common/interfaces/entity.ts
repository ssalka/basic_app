import { ID, IDocument } from './mongo';

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

export type EntityDocument = IEntity & IDocument<'Entity'>;

export type PopulatedEntityDocument<T = {}> = IPopulatedEntity<T> & IDocument<'Entity'>;

export const enum EntityEventType {
  Created = 'ENTITY_CREATED',
  Requested = 'ENTITIES_REQUESTED',
  Updated = 'ENTITY_UPDATED'
}
