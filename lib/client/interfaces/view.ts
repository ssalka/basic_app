import { Collection } from './Collection';
import { IUser } from './User';

// TODO: make this match the mongoose model
export interface IView {
  name: string;
  path: string;
  icon: string;
  collections: Collection[];
  creator: IUser;
  description?: string;
  public: boolean;
}
