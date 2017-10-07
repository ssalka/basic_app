import { Collection } from './collection';

export interface IUser {
  username: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
  library: {
    views: any[];
    collections: Collection[];
  };
}

export class User implements IUser {
  constructor(
    public username: string,
    public email: string,
    public name: {
      first: string,
      last: string,
    },
    public library: {
      views: any[],
      collections: Collection[],
    }
  ) {}
}
