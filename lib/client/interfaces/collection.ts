declare const _;

import { User } from './user';

export class Field implements Field {
  constructor(
    public name: string = '',
    public type: string = 'STRING',
    public required: boolean = false,
    public isArray: boolean = false
  ) {}
}

export interface Collection {
  _id: string;
  name: string;
  _db: string;
  _collection: string;
  fields: Field[];
  creator: User;
  description?: string;
  icon?: string;
  defaultView?: any;
  views: any[];
}

export class Collection implements Collection {
  constructor(collection: Partial<Collection> = {}) {
    _.extend(this, collection);
  }
}
