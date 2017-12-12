import { IEvent } from './events';
import { ID, IDocument } from './mongo';

export interface IReference {
  type: string;
  value: ID;
}

export interface IPopulatedReference<Ref extends IReference = IReference> {
  type: string;
  value: IDocument<Ref['value']>;
}

export interface IEntity {
  name: string;
  references: IReference[];
}

export interface IPopulatedEntity {
  name: string;
  references: IPopulatedReference[];
}

export type EntityDocument = IEntity & IDocument<'Entity'>;

export type PopulatedEntityDocument = IEntity & IDocument<'Entity'>;

export const enum EntityEventType {
  Created = 'ENTITY_CREATED',
  Requested = 'ENTITIES_REQUESTED'
}

export type CreateEntityEvent = IEvent<IEntity>;

export type EntityEvent = CreateEntityEvent;
