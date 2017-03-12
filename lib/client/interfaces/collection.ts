declare const _;

import { User } from './user';

export class Field {
  constructor(
    public name: string = '',
    public type: string = 'STRING',
    public required: boolean = false,
    public isArray: boolean = false
  ) {}
}

export class Collection {
  public _id: string;
  public name: string;
  public _db: string;
  public _collection: string;
  public fields: Field[];
  public creator: User;
  public description?: string;
  public icon?: string;
  public path: string;
  public defaultView?: any;
  public views: any[];

  constructor(collection: Partial<Collection> = {}) {
    _.extend(this, collection);
  }
}
