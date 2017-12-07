import { IEvent } from './events';
import { ID, IDocument } from './mongo';

export interface IValue<T = any> {
  value: T;
}

export type ValueDocument<T = any> = IValue<T> & IDocument;

export const enum ValueEventType {
  Created = 'VALUE_CREATED',
  Requested = 'VALUES_REQUESTED'
}

export interface IIdentifier {
  name: string; // if resolved, should be value of document at name key
  references: {
    [domainModel: string]: ID | IDocument;
  };
}

export type CreateValueEvent = IEvent<IValue>;

export type ValueEvent = CreateValueEvent;
