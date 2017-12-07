import * as _ from 'lodash';

import { IDocument } from './mongo';
import { User } from './user';

export interface IRenderMethod {
  key: string;
  name: string;
  targetProp: string;
  inputType: string;
}

export interface IType {
  key: string;
  name: string;
  primitiveType(val: any): any;
  icon: string;
}

export class Field {
  constructor(
    public name: string = '',
    public type: string = 'STRING',
    public required: boolean = false,
    public isArray: boolean = false,
    public renderMethod: string = 'PLAIN_TEXT',
    public _collection?: string,
    public view?: string
  ) {}
}

// TODO: fully implement IDocument interface
export class Collection implements Pick<IDocument, '_id' | '_model'> {
  public _id: string;
  public name: string;
  public _db: string;
  public _collection: string;
  public fields: Field[];
  public creator: User;
  public description?: string;
  public icon?: string;
  public path: string;
  public slug?: string;
  public defaultView?: any;
  public views: any[];
  public typeFormats: {
    pascalCase: string;
  };
  public _model: string;

  constructor(collection: Partial<Collection> = {}) {
    _.extend(this, collection);
  }
}
