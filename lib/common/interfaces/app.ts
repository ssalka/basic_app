import { IUser } from './user';

export interface IContext {
  appName: string;
  user?: IUser;
}

export interface IIcon {
  id: string;
  name: string;
  group: string;
  tags: string[];
}