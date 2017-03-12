import { IUser } from './user';

export interface IContext {
  appName: string;
  user?: IUser;
}
