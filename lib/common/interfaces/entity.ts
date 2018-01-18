import { Field } from './field';
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
  fields: (string | Field)[];
}

export interface IPopulatedEntity<T = {}> {
  name: string;
  references: IPopulatedReference<T>[];
}

export type EntityDocument = Versioned<IEntity & IDocument<'Entity'>>;

export type PopulatedEntityDocument<T = {}> = IPopulatedEntity<T> & IDocument<'Entity'>;
