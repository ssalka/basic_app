import { Collection } from './Collection';
import { IUser } from './User';

export interface IView {
  name: string;
  type: string;
  collections: Collection[];
  creator: IUser;
  description?: string;
  public: boolean;
}
