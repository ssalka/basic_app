import { Collection } from './collection';

export interface User {
  username: string;
  email: string;
  name: {
    first: string;
    last: string;
  };
  library: {
    views: any[];
    collection: Collection[];
  };
}

export class User implements User {
  constructor(
    public username: string,
    public email: string,
    public name: {
      first: string,
      last: string,
    },
    public library: {
      views: any[],
      collection: Collection[],
    }
  ) {}
}
